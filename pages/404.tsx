import Head from 'next/head';

export default function Error404() {
    return (
        <div style={{ textAlign: 'center' }}>
            <Head>
                <title>Erreur 404 page introuvable</title>
            </Head>
            <div className="d-flex align-items-center justify-content-center vh-100 bg-primary">
                <h1 className="display-1 fw-bold text-white">404</h1>
            </div>
        </div>
    );
}
