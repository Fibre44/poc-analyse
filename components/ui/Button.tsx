import React from "react";
import { Loader } from "./Loader";
import type { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
    loading: boolean
}>


export function Button({ children, loading = false }: Props) {

    return <button className='btn btn-primary' type="submit" disabled={loading}>
        {loading ? <><Loader /> Chargement </> : children}
    </button>

}