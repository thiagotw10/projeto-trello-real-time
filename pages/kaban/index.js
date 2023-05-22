import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/kaban.module.css";
import { io } from 'socket.io-client'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { AiOutlineEllipsis } from "react-icons/ai";
import DetalhesModal from "./DetalhesModal";
import FormAgendar from "./FormAgendar";
import url from "./url";
import SelectNome from "./SelectNome";
import { useRouter } from "next/router";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 1,
  margin: `0 0 ${grid}px 0`, 
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",
  // styles we need to apply on draggables
  ...draggableStyle,
  minHeight: '160px'
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 300,
  overflowY: 'auto',
  height: '85vh',
});

export default function Kaban() {
    const route = useRouter();
    const [socket, setSocket] = useState(null);


    const [exibirModal, setExibirModal] = useState(false);
    const [exibirAgendar, setExibirAgendar] = useState(false);
    const [modalData, setModalData] = useState(null);


    
    const [items, setitems] = useState([]);
    const [mantemItems, setMantemItens] = useState([]);

    const [column2Items, setColumn2Items] = useState([]);
    const [column3Items, setColumn3Items] = useState([]);
    const [column4Items, setColumn4Items] = useState([]);
    const [column5Items, setColumn5Items] = useState([]);

    const [colum1Count, setcolum1Count] = useState(0);
    const [colum2Count, setcolum2Count] = useState(0);
    const [colum3Count, setcolum3Count] = useState(0);
    const [colum4Count, setcolum4Count] = useState(0);
    const [colum5Count, setcolum5Count] = useState(0);

    const [selectPorNome, setSelectPorNome] = useState([]);
    const [selectPorSala, setSelectPorSala] = useState([]);
    const [selectPorSetor, setSelectPorSetor] = useState([]);
    const [selectPorNomeValor, setSelectPorNomeValor] = useState(undefined);

    const modalConteudo = (item) => {
        setModalData(item);
        setExibirModal(true);
    };

    const fecharModal = () => {
        setModalData(null);
        setExibirModal(false);
    };

   
    const fecharAgendar = () =>{
        setExibirAgendar(false)
        socket.emit('cardRender', {url: url().url + '/moinhos', token: url().config})
    }


    const filtroNome = (value) =>{
        setSelectPorNomeValor(value)
        if(value.nome == '' || value.setor == '' || value.sala == ''){
          setitems(mantemItems.solicitados)
          setColumn2Items(mantemItems.agendados)
          setColumn3Items(mantemItems.pos_exame)
          setColumn4Items(mantemItems.atendimento)
          setColumn5Items(mantemItems.finalizados)
          setcolum1Count(mantemItems.solicitados.length)
          setcolum2Count(mantemItems.agendados.length)
          setcolum3Count(mantemItems.pos_exame.length)
          setcolum4Count(mantemItems.atendimento.length)
          setcolum5Count(mantemItems.finalizados.length)
          return 
        }


        const valores = Object.values(value); 
        let solicitadosNovos = mantemItems.solicitados.filter((val)=> valores.includes(value.nome ? val.paciente : value.sala ? val.sala : val.setor_exame))
        let agendadosNovos = mantemItems.agendados.filter((val)=> valores.includes(value.nome ? val.paciente : value.sala ? val.sala : val.setor_exame))
        let atendimentosNovos = mantemItems.atendimento.filter((val)=> valores.includes(value.nome ? val.paciente : value.sala ? val.sala : val.setor_exame))
        let posexamesNovos = mantemItems.pos_exame.filter((val)=> valores.includes(value.nome ? val.paciente : value.sala ? val.sala : val.setor_exame))
        let finalizadosNovos = mantemItems.finalizados.filter((val)=> valores.includes(value.nome ? val.paciente : value.sala ? val.sala : val.setor_exame))
        setitems(solicitadosNovos)
        setColumn2Items(agendadosNovos)
        setColumn3Items(atendimentosNovos)
        setColumn4Items(posexamesNovos)
        setColumn5Items(finalizadosNovos)

        setcolum1Count(solicitadosNovos.length)
        setcolum2Count(agendadosNovos.length)
        setcolum3Count(atendimentosNovos.length)
        setcolum4Count(posexamesNovos.length)
        setcolum5Count(finalizadosNovos.length)
    }



    useEffect(() => {
        const socket = io('http://localhost:3001')
        setSocket(socket)
        socket.on('connect', () => {
          if(!selectPorNomeValor){
            socket.emit('cardRender', {url: url().url + '/moinhos', token: url().config})
          }
        })
    
        socket.on('disconnect', () => {
          console.log('disconnected')
        })

        const atualizaValores = (message)=>{
          return new Promise((resolve, reject)=>{
            setMantemItens(message)
            setitems(message.solicitados)
            setColumn2Items(message.agendados)
            setColumn3Items(message.atendimento)
            setColumn4Items(message.pos_exame)
            setColumn5Items(message.finalizados)
            setcolum1Count(message.count.total_solicitatos)
            setcolum2Count(message.count.total_agendados)
            setcolum3Count(message.count.total_atendimento)
            setcolum4Count(message.count.total_pos_exame)
            setcolum5Count(message.count.total_finalizados)
            setSelectPorNome(message.lista_nome)
            setSelectPorSala(message.filtroSala)
            setSelectPorSetor(message.filtro)
            resolve(true)
          })
        }
    
        socket.on('cardRender', async (msg)=>{
          let message = await JSON.parse(msg.dados)
          let rodou = await atualizaValores(message)
          if(rodou){
            if(selectPorNomeValor !== undefined && selectPorNomeValor !== null){
              let nome = (selectPorNomeValor.nome == '' || selectPorNomeValor.nome == undefined) ? false : true
              let sala = (selectPorNomeValor.sala == '' || selectPorNomeValor.sala == undefined) ? false : true
              let setor = (selectPorNomeValor.setor == '' || selectPorNomeValor.setor == undefined) ? false : true
             
              if(nome || sala || setor){
                const valores = Object.values(selectPorNomeValor); 
                let solicitadosNovos = message.solicitados.filter((val)=> valores.includes(selectPorNomeValor.nome ? val.paciente : selectPorNomeValor.sala ? val.sala : val.setor_exame))
                let agendadosNovos = message.agendados.filter((val)=> valores.includes(selectPorNomeValor.nome ? val.paciente : selectPorNomeValor.sala ? val.sala : val.setor_exame))
                let atendimentosNovos = message.atendimento.filter((val)=> valores.includes(selectPorNomeValor.nome ? val.paciente : selectPorNomeValor.sala ? val.sala : val.setor_exame))
                let posexamesNovos = message.pos_exame.filter((val)=> valores.includes(selectPorNomeValor.nome ? val.paciente : selectPorNomeValor.sala ? val.sala : val.setor_exame))
                let finalizadosNovos = message.finalizados.filter((val)=> valores.includes(selectPorNomeValor.nome ? val.paciente : selectPorNomeValor.sala ? val.sala : val.setor_exame))
                setitems(solicitadosNovos)
                setColumn2Items(agendadosNovos)
                setColumn3Items(atendimentosNovos)
                setColumn4Items(posexamesNovos)
                setColumn5Items(finalizadosNovos)

                setcolum1Count(solicitadosNovos.length)
                setcolum2Count(agendadosNovos.length)
                setcolum3Count(atendimentosNovos.length)
                setcolum4Count(posexamesNovos.length)
                setcolum5Count(finalizadosNovos.length)
              }
            }
          }
         
        })
    
        return () => {
          socket.disconnect()
        }
      }, [selectPorNomeValor])

    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }

      
  
      if (result.source.droppableId === "droppable1" && result.destination.droppableId === "droppable2") {
        const item = items[result.source.index];
        setitems((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn2Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

        setExibirAgendar(true)
        setModalData(item);


      } else if (result.source.droppableId === "droppable2" && result.destination.droppableId === "droppable1") {
        const item = column2Items[result.source.index];

        setColumn2Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setitems((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });


        axios.post(url().url + '/moinhos/cancelar', {
            acess_number: item.acess_number,
            identificacao: 1,
            codigo_setor_exame:  item.codigo_setor_exame,
            data: item.hora_pedidoX,
        }, url().config).then(()=>{
           socket.emit('cardRender', {url: url().url + '/moinhos', token: url().config})
        }).catch((error)=> console.log(error))

      } else if (result.source.droppableId === "droppable2" && result.destination.droppableId === "droppable3"){
        const item = column2Items[result.source.index];

        setColumn2Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn3Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      } else if (result.source.droppableId === "droppable3" && result.destination.droppableId === "droppable2"){
        const item = column3Items[result.source.index];

        setColumn3Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn2Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      } else if(result.source.droppableId === "droppable3" && result.destination.droppableId === "droppable4"){
        const item = column3Items[result.source.index];

        setColumn3Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn4Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      } else if(result.source.droppableId === "droppable4" && result.destination.droppableId === "droppable3"){
        const item = column4Items[result.source.index];

        setColumn4Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn3Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      } else if(result.source.droppableId === "droppable4" && result.destination.droppableId === "droppable5"){
        const item = column4Items[result.source.index];

        setColumn4Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn5Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      } else if(result.source.droppableId === "droppable5" && result.destination.droppableId === "droppable4"){
        const item = column5Items[result.source.index];

        setColumn5Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.source.index, 1);
          return newItems;
        });

        setColumn4Items((prevItems) => {
          const newItems = Array.from(prevItems);
          newItems.splice(result.destination.index, 0, item);
          return newItems;
        });

      }
    };
  
    return (
        <>
          <div><SelectNome optionsNome={selectPorNome} onMatheus={filtroNome} optionsSala={selectPorSala} optionsSetor={selectPorSetor}/></div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles.drag}>
                <div className={styles.column}>
                <div className={styles.titulo}>
                    <h4>Solicitados</h4>
                    <p>{colum1Count}</p>
                </div>
                <Droppable droppableId="droppable1">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {items.map((item, index) => (
                        <Draggable key={item.acess_number} draggableId={String(item.acess_number)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                                )}
                            >
                                <div className={styles.card}>
                                    <div className={item.cor_classificacao == 'VERDE' ? styles.nomeverde : item.cor_classificacao == 'AMARELO' ? styles.nomeamarelo : styles.nomelaranja}><span>{item.paciente}</span></div>
                                    <div className={styles.conteudo}>
                                        <div className={styles.atendimento}><span><b>At.</b> {item.atendimento}</span><span><b>AN.</b> {item.acess_number}</span><span className={styles.bolinha}>{item.data_diferenca}</span></div>
                                        <span><b>Data nasc.</b> {item.data_nasc}</span>
                                        <span><b>Exame.</b> {item.descricao_exame}</span>
                                        <span><b>Setor.</b> {item.setor}</span>
                                        <div className={styles.atendimento}><span><b>Solicitado em </b> {item.data_movimentacao}</span><AiOutlineEllipsis onClick={()=>{modalConteudo(item)}} className={styles.icones}></AiOutlineEllipsis></div>
                                    </div>
                                </div>

                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </div>

                <div className={styles.column}>
                <div className={styles.titulo}>
                    <h4>Agendados</h4>
                    <p>{colum2Count}</p>
                </div>
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column2Items.map((item, index) => (
                        <Draggable key={item.acess_number} draggableId={String(item.acess_number)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                                )}
                            >
                                <div className={styles.card}>
                                    <div className={item.cor_classificacao == 'VERDE' ? styles.nomeverde : item.cor_classificacao == 'AMARELO' ? styles.nomeamarelo : styles.nomelaranja}><span>{item.paciente}</span></div>
                                    <div className={styles.conteudo}>
                                        <div className={styles.atendimento}><span><b>At.</b> {item.atendimento}</span><span><b>AN.</b> {item.acess_number}</span><span className={styles.bolinha}>{item.data_diferenca}</span></div>
                                        <span><b>Data nasc.</b> {item.data_nasc}</span>
                                        <span><b>Exame.</b> {item.descricao_exame}</span>
                                        <span><b>Setor.</b> {item.setor}</span>
                                        <div className={styles.atendimento}><span><b>Agendado para </b> {item.data_agendamento} - {item.hora_agendamento}</span><AiOutlineEllipsis onClick={()=>{modalConteudo(item)}} className={styles.icones}></AiOutlineEllipsis></div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </div>

                <div className={styles.column}>
                <div className={styles.titulo}>
                    <h4>Atendimento</h4>
                    <p>{colum3Count}</p>
                </div>
                <Droppable droppableId="droppable3">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column3Items.map((item, index) => (
                        <Draggable key={item.acess_number} draggableId={String(item.acess_number)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                                )}
                            >
                                <div className={styles.card}>
                                    <div className={item.cor_classificacao == 'VERDE' ? styles.nomeverde : item.cor_classificacao == 'AMARELO' ? styles.nomeamarelo : styles.nomelaranja}><span>{item.paciente}</span></div>
                                    <div className={styles.conteudo}>
                                        <div className={styles.atendimento}><span><b>At.</b> {item.atendimento}</span><span><b>AN.</b> {item.acess_number}</span><span className={styles.bolinha}>{item.data_diferenca}</span></div>
                                        <span><b>Data nasc.</b> {item.data_nasc}</span>
                                        <span><b>Exame.</b> {item.descricao_exame}</span>
                                        <span><b>Setor.</b> {item.setor}</span>
                                        <div className={styles.atendimento}><span><b>Solicitado em </b> {item.data_movimentacao}</span><AiOutlineEllipsis onClick={()=>{modalConteudo(item)}} className={styles.icones}></AiOutlineEllipsis></div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </div>

                <div className={styles.column}>
                <div className={styles.titulo}>
                    <h4>Pós exame</h4>
                    <p>{colum4Count}</p>
                </div>
                <Droppable droppableId="droppable4">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column4Items.map((item, index) => (
                        <Draggable key={item.acess_number} draggableId={String(item.acess_number)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                                )}
                            >
                                <div className={styles.card}>
                                    <div className={item.cor_classificacao == 'VERDE' ? styles.nomeverde : item.cor_classificacao == 'AMARELO' ? styles.nomeamarelo : styles.nomelaranja}><span>{item.paciente}</span></div>
                                    <div className={styles.conteudo}>
                                        <div className={styles.atendimento}><span><b>At.</b> {item.atendimento}</span><span><b>AN.</b> {item.acess_number}</span><span className={styles.bolinha}>{item.data_diferenca}</span></div>
                                        <span><b>Data nasc.</b> {item.data_nasc}</span>
                                        <span><b>Exame.</b> {item.descricao_exame}</span>
                                        <span><b>Setor.</b> {item.setor}</span>
                                        <div className={styles.atendimento}><span><b>Solicitado em </b> {item.data_movimentacao}</span><AiOutlineEllipsis onClick={()=>{modalConteudo(item)}} className={styles.icones}></AiOutlineEllipsis></div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </div>

                <div className={styles.column}>
                <div className={styles.titulo}>
                    <h4>Finalizados</h4>
                    <p>{colum5Count}</p>
                </div>
                <Droppable droppableId="droppable5">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column5Items.map((item, index) => (
                        <Draggable key={item.acess_number} draggableId={String(item.acess_number)} index={index}>
                            {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                                )}
                            >
                                <div className={styles.card}>
                                    <div className={item.cor_classificacao == 'VERDE' ? styles.nomeverde : item.cor_classificacao == 'AMARELO' ? styles.nomeamarelo : styles.nomelaranja}><span>{item.paciente}</span></div>
                                    <div className={styles.conteudo}>
                                        <div className={styles.atendimento}><span><b>At.</b> {item.atendimento}</span><span><b>AN.</b> {item.acess_number}</span><span className={styles.bolinha}>{item.data_diferenca}</span></div>
                                        <span><b>Data nasc.</b> {item.data_nasc}</span>
                                        <span><b>Exame.</b> {item.descricao_exame}</span>
                                        <span><b>Setor.</b> {item.setor}</span>
                                        <div className={styles.atendimento}><span><b>Solicitado em </b> {item.data_movimentacao}</span><AiOutlineEllipsis onClick={()=>{modalConteudo(item)}} className={styles.icones}></AiOutlineEllipsis></div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
                </div>
            </div>
          </DragDropContext>
          
          {exibirModal && (
                <DetalhesModal dados={modalData} onClose={fecharModal} />
          )}

          {exibirAgendar && (<FormAgendar  onFechar={fecharAgendar} dados={modalData} />)}
          
          <div><Link href="/">Voltar</Link></div>
        </>
      );
    
}