import Field from "../ui/Field";
import { useRef } from 'react';
import { apiFetch } from '../../utils/api';
import { useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/router";
type Society = {
    _id: string,
    adress1: string,
    adress2: string | undefined,
    adress3: string | undefined,
    zipCode: string,
    apen: string,
    city: string,
    nic: string,
    siren: string
}
export function FormSociety({ society }: { society: Society }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useRef(null)

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        console.log(e.target)
        if (form.current) {
            const formData = new FormData(form.current)
            const data = Object.fromEntries(formData)
            const response = await apiFetch('/api/society/', {
                method: 'PUT',
                body: JSON.stringify(data),
            });
            if (response) {
                setLoading(false)
                router.push({
                    pathname: '/projet/[slug]',
                    query: {
                        slug: response.client
                    }
                })
            }

        }
    }
    return <div className="container">
        <form ref={form} onSubmit={handleSubmit}>
            <Field type="text" name="siren" error={null} value={society.siren} required={false}>
                Siren
            </Field>
            <Field type="text" name="nic" error={null} value={society.nic} required={false}>
                nic
            </Field>
            <Field type="text" name="apen" error={null} value={society.apen} required={false}>
                Apen
            </Field>
            <Field type="text" name="adress1" error={null} value={society.adress1} required={false}>
                Adresse 1
            </Field>
            <Field type="text" name="adress2" error={null} value={society.adress2} required={false}>
                Adresse 2
            </Field>
            <Field type="text" name="adress3" error={null} value={society.adress3} required={false}>
                Adresse 3
            </Field>
            <Field type="text" name="zipCode" error={null} value={society.zipCode} required={false}>
                Code postal
            </Field>
            <Field type="text" name="city" error={null} value={society.city}>
                Ville
            </Field>

            <Button loading={loading}>Envoyer la dsn</Button>

        </form>

    </div>
}