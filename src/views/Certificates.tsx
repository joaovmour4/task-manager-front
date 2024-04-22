import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import SearchBar from "../components/searchBar/SearchBar";
import ValidTag from "../components/validTag/ValidTag";
import EditCertificate from '../views/EditCertificate'
import AddCertificateModal from "../modals/AddCertificate";
import ResponseModal from "../modals/ResponseModal";
import ConfirmModal from "../modals/ConfirmModal";
import SortInfo from "../components/SortInfo/SortInfor";
import { AxiosResponse } from "axios";

export interface Certificate{
    _id: string
    owner: string
    docOwner: string
    issuing: string
    [valid: string]: string
}

function Certificates(){
    const [arr, setArr] = useState<Array<Certificate>>([])
    const [search, setSearch] = useState('')
    const [sortConfig, setSortConfig] = useState({key:'owner', direction:'ascending'})
    const [filter, setFilter] = useState('all')
    const [id, setId] = useState('')
    const [owner, setOwner] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showResponseModal, setShowResponseModal] = useState(false)
    const [file, setFile] = useState<File | null >(null)
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState<AxiosResponse | null>(null)

    const sortArr = useCallback(()=>{
            let responseArr = arr
            responseArr.sort((a, b) => {
                const valueA = sortConfig.key === 'valid' ? Date.parse(a[sortConfig.key]):a[sortConfig.key].toUpperCase()
                const valueB = sortConfig.key === 'valid' ? Date.parse(b[sortConfig.key]):b[sortConfig.key].toUpperCase()
                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? 1:-1
                }
                else if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? -1:1
                }
            
                // names must be equal
                return 0
            })

            return responseArr
        }, [arr, sortConfig])

    const requestSort = (key:string) => {
        let direction = 'ascending'
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    function handdleEdit(owner: string){
        setOwner(owner)
        setShowModal(true)
    }

    function handleRemove(_id: string, owner: string){
        setId(_id)
        setOwner(owner)
        setShowConfirmModal(true)
        // api
        //     .delete(`/certificate/${_id}`)
        //     .then(response => {
        //         setResponse(response)
        //         setShowResponseModal(true)
        //         console.log(response)
        //     })
        //     .catch(err => {
        //         console.log(err.message)
        //     })
    }
    
    useEffect(()=>{
        const delayDebounceFn = setTimeout(()=>{
            api
                .get(`/certificate/'${search}'&${filter}`)
                .then(response => {
                    setArr(response.data)
                })
                .catch(err => {
                    console.error('Ocorreu um erro ao processar a requisição!')
                })
        }, 300)

        return ()=> clearTimeout(delayDebounceFn)
    }, [search, filter])

    useEffect(()=>{
        setArr(sortArr())
    }, [arr, sortArr])

    return(
        <div className="flex flex-col justify-between h-full w-full px-20 py-10 font-thin">
            <h1 className="flex-1 text-3xl pb-10">Certificados</h1>
            
            <div className="flex flex-row justify-between pb-10 flex-wrap">
                {SearchBar(setSearch, setFilter)}
                <button onClick={() => setShowAddModal(true)} className="text-white rounded bg-green-600 px-5 place-self-center hover:bg-green-500 active:bg-green-600 shadow hover:shadow-lg">Adicionar Certificado</button>
            </div>

            <table className="flex-1 grow w-full table-auto text-center divide-y">
                <thead>
                    <tr>
                        <th className="w-3/5 ">
                            <button className="flex justify-self-start items-center" onClick={()=>{requestSort('owner')}}>
                                <th className="text-left pl-5 pr-1">Nome</th>
                                {SortInfo(sortConfig, 'owner')}
                            </button>
                        </th>
                        <th>
                            Emissão
                        </th>
                        <th className="flex justify-center">
                            <button className="flex items-center" onClick={()=>{requestSort('valid')}}>
                            <th>Validade</th>
                                {SortInfo(sortConfig, 'valid')}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y content-center">
                    {arr.map((certificate: Certificate) =>{
                        return(
                            <tr>
                                <td>
                                    <div className="text-left flex flex-row pl-5">
                                        <p className="grow text-wrap">{certificate?.owner}</p>
                                        <p>{ValidTag(certificate?.valid)}</p>
                                    </div>
                                </td>
                                <td>{new Date(certificate?.issuing).toLocaleDateString('pt-BR')}</td>
                                <td>{new Date(certificate?.valid).toLocaleDateString('pt-BR')}</td>
                                <td className="flex justify-evenly content-center">
                                    <button onClick={() => {handdleEdit(certificate?.owner)}}><svg className="h-5 w-5 hover:fill-yellow-500" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/></svg></button>
                                    <button onClick={() => handleRemove(certificate?._id, certificate?.owner)}><svg className="h-5 w-5 hover:fill-red-500" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg></button>
                                    {showModal ? EditCertificate(setShowModal, owner, certificate?.docOwner, file, setFile, password, setPassword, setResponse, setShowResponseModal):null}
                                    {showAddModal ? AddCertificateModal(setShowAddModal, file, setFile, password, setPassword, setResponse, setShowResponseModal): null}
                                    {showResponseModal ? ResponseModal(setShowResponseModal, response, setShowAddModal):null}
                                    {showConfirmModal ? <ConfirmModal id={id} name={owner} deleteType="certificate" setShowModal={setShowConfirmModal}/>:null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Certificates