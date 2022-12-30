import Link from 'next/link';

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

export function Society({ society }: { society: Society }) {
    return <div className="card mb-2">
        <h5 className="card-header">siren : {society.siren}</h5>
        <div className="card-body">
            <h5 className="card-title">Information</h5>
            <p className="card-text">Adresse 1 : {society.adress1}</p>
            <p className="card-text">Adresse 2 : {society.adress2}</p>
            <p className="card-text">Adresse 3 : {society.adress3}</p>
            <p className="card-text">Code postal : {society.zipCode}</p>
            <p className="card-text">Code apen : {society.apen}</p>
            <Link href={`/society/${society.siren}`}>
                Editer la fiche
            </Link>
        </div>
    </div>
} 