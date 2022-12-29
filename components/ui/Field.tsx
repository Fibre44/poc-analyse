import type { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
    type: string,
    name: string,
    required?: boolean
    error: string | null,
}>

export default function Field({ type, name, error, children, required = true }: Props,) {
    return <div className="form-group">
        {children && <label htmlFor={name}>{children}</label>}
        <input type={type} name={name} id={name} className="form-control" required={required} />
        {error === null ? "" : <div className="form-group">{error}</div>}
    </div>
}