import type { PropsWithChildren } from "react"
import { useState } from "react"
type Props = PropsWithChildren<{
    type: string,
    name: string,
    required?: boolean
    error: string | null,
    placeholder?: string,
    value?: string
}>

export default function Field({ type, name, error, children, required = true, placeholder, value = undefined }: Props,) {
    const [input, setInput] = useState(value)
    //Si value existe alors React controlera le champ sinon on laisse le dom controler
    return <div className="form-group row mb-2">
        {children && <label htmlFor={name} className="col-sm-2 col-form-label">{children} </label>}
        <div className="col-sm-10">
            {value ?
                <input type={type} name={name} id={name} className="form-control" required={required} placeholder={placeholder} value={input} onChange={e => setInput(e.target.value)} />
                :
                <input type={type} name={name} id={name} className="form-control" required={required} placeholder={placeholder} />
            }
        </div>

        {error === null ? "" : <div className="form-group">{error}</div>}
    </div >
}