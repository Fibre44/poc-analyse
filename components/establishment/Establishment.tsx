import Link from 'next/link';

type Establishment = {
    _id: string,
    adress1: string,
    adress2: string | undefined,
    adress3: string | undefined,
    zipCode: string,
    apen: string,
    city: string,
    siren: string,
    nic: string
}

export function Establishment({ establishment }: { establishment: Establishment }) {
    return <div className="card mb-2">
        <h5 className="card-header">Siret : {establishment.siren + establishment.nic}</h5>
        <div className="card-body">
            <h5 className="card-title">Information</h5>
            <p className="card-text">Adresse 1 : {establishment.adress1}</p>
            <p className="card-text">Adresse 2 : {establishment.adress2}</p>
            <p className="card-text">Adresse 3 : {establishment.adress3}</p>
            <p className="card-text">Code postal : {establishment.zipCode}</p>
            <p className="card-text">Code apen : {establishment.apen}</p>
            <Link href={{
                pathname: `/establishment/[slug]`,
                query: {
                    slug: establishment.siren + establishment.nic
                }
            }}>
                Editer la fiche
            </Link>
        </div>
    </div>
} 