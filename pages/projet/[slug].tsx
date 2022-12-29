import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next'
import Head from 'next/head';
import { connectMongoDb } from '../../utils/connectMongoDb';
import Field from '../../components/ui/Field';
import { useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
type Props = {
    projet: Projet
}

type Projet = {
    client: string,
    date: Date
}

export default function Projet(props: Props) {
    const [loading, setLoading] = useState(false)
    const { client, date } = props.projet
    const form = useRef(null)
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (form.current) {
            const formData = new FormData(form.current)
            formData.append('client', client)
            const response = await fetch('/api/projets/dsn/uploadFile', {
                method: 'POST',
                body: formData,
            });
            setLoading(false)
        }
    }
    return (
        <>
            <Head>
                <title>{client}</title>
            </Head>
            <div className="container">
                <p>{client}</p>
                <form ref={form} onSubmit={handleSubmit} encType='multipart/form-data'>
                    <Field type="file" name="dsn" error={null}>
                        Fichier DSN
                    </Field>
                    <Button loading={loading}>Envoyer la dsn</Button>
                </form>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({ req: context.req });
    let { params } = context;
    const slug = params?.slug;
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    } else {
        try {
            const client = await connectMongoDb()
            const db = client.db();
            // Récupérer les projets
            const projet = await db
                .collection('projets')
                .find({ client: slug })
                .toArray()
            console.log(projet[0])
            return {
                props: {
                    projet: JSON.parse(JSON.stringify(projet[0])),
                },
            };
        } catch (e) {
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };
        }


    }

}
