import Link from "next/link"
import styles from '@/styles/Atividade.module.css'
import { useState } from "react"
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { AiFillCloseSquare } from "react-icons/ai"

export default function Atividade() {
  const [socket, setSocket] = useState(null);
  const [lista, setLista] = useState([])
  const [inputAtividade, setInputAtividade] = useState()
  

  useEffect(() => {
    const socket = io('http://localhost:3001')
    setSocket(socket)
    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('cardRender', (msg)=>{
      let message = JSON.parse(msg.dados)
      if(message)
      setLista(message)
    })

    return () => {
      socket.disconnect()
    }
  }, [])




  function carrega(){
    socket.emit('cardRender', {tarefa: inputAtividade})
    setInputAtividade('')
  }

  function apagar(val){
    socket.emit('apagar', val)
  }

    return (
      <>
      <div>
        <h1>Lista de atividades</h1>
        <input type="text" value={inputAtividade} onChange={(event)=>{setInputAtividade(event.target.value)}} />
        {lista.length > 0 ? lista.map((val) => {
          return <li key={val.tarefa}>{val.tarefa} <AiFillCloseSquare className={styles.icone} onClick={()=>{apagar(val.tarefa)}} /></li>
        }) : null}
        <button onClick={()=>{carrega()}}>anotar</button>


        <Link href="/">Voltar</Link>
      </div>
      </>
    )
  }

