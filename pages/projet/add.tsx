import { getSession } from 'next-auth/react';
import { useRef } from 'react';
import { GetServerSideProps } from 'next'
import Field from '../../components/ui/Field';
import { apiFetch } from '../../utils/api';
export default function Projets() {
    const form = useRef(null)

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.current) {
            const formData = new FormData(form.current)
            const data = Object.fromEntries(formData)
            const response = await apiFetch('/api/projets/', {
                method: 'POST',
                body: JSON.stringify(data),
            });

        }
    }

    return <div className="container mt-5" >
        <form ref={form} onSubmit={handleSubmit}>
            <Field type="text" name="client" error={null}>
                Nom du client
            </Field>
            <Field type="text" name="description" error={null}>
                Description du projet
            </Field>
            <Field type="date" name="date" error={null}>
                Date de début projet
            </Field>
            <input type="submit" />

        </form>
    </div>
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    return {
        props: { session },
    };
}
