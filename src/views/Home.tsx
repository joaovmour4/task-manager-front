import React from "react";

function Home(){
    return(
        <div className="flex flex-col flex-1 justify-center items-center font-thin text-center px-9">
            <h1 className="text-5xl pb-5">Gerenciador de Atividades Gagliardi Contabilidade</h1>
            <p className="text-2xl">
                Gerencie as atividades e obrigações a serem feitas para as empresas cadastradas. Além de visualizar informações sobre seus certificados como vencimento, CPF ou CNPJ e identificação do proprietário. Além de configurar recebimento de e-mails periódicos com informações importantes sobre vencimentos dos Certificados Digitais cadastrados.
            </p>
        </div>
    )
}

export default Home