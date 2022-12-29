import Link from 'next/link';
type Props = {
    projet: {
        _id: string,
        client: string
        date: Date
    }
}

export function ProjetCard(props: Props) {
    const { _id, client, date } = props.projet
    return <div className="card mb-2">
        <div className="card-body">
            <h5 className="card-title">{client}</h5>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <Link href={`projet/${client}`}>
                Accéder au projet
            </Link>
        </div>
    </div>


}