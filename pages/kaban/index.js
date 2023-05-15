import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/kaban.module.css";
import { io } from 'socket.io-client'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import { AiOutlineEllipsis } from "react-icons/ai";
import DetalhesModal from "./DetalhesModal";
import FormAgendar from "./FormAgendar";


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



const config = {
    headers: { Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4wLjg1OjUwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjgyMzgwNDIzLCJleHAiOjE2ODUwMDg0MjMsIm5iZiI6MTY4MjM4MDQyMywianRpIjoiWVFaSEp2cmRpdHJsRFFydSIsInN1YiI6IjIiLCJwcnYiOiI0YTU2OGU0ZDM2NGEyMmRlY2FhYTJlMjNhM2Y3NDNmNzhhYWYxNTllIn0.itWbAmYSvB8NAmQ-jotwi6vxRrrV595uJurceYn2qA4` }
};

export default function Kaban() {

    const [socket, setSocket] = useState(null);

    const [exibirModal, setExibirModal] = useState(false);
    const [exibirAgendar, setExibirAgendar] = useState(false);
    const [modalData, setModalData] = useState(null);

    const modalConteudo = (item) => {
        console.table(item);
        setModalData(item);
        setExibirModal(true);
    };

    const fecharModal = () => {
        setModalData(null);
        setExibirModal(false);
    };

   
    const fecharAgendar = () =>{
        setExibirAgendar(false)
        socket.emit('cardRender', {url: 'http://10.86.32.44:80/api-moinhos-production/public/api/moinhos', token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4wLjg1OjUwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjgyMzgwNDIzLCJleHAiOjE2ODUwMDg0MjMsIm5iZiI6MTY4MjM4MDQyMywianRpIjoiWVFaSEp2cmRpdHJsRFFydSIsInN1YiI6IjIiLCJwcnYiOiI0YTU2OGU0ZDM2NGEyMmRlY2FhYTJlMjNhM2Y3NDNmNzhhYWYxNTllIn0.itWbAmYSvB8NAmQ-jotwi6vxRrrV595uJurceYn2qA4'})
    }


    const [items, setitems] = useState([]);
    const [column2Items, setColumn2Items] = useState([]);
    const [column3Items, setColumn3Items] = useState([]);
    const [column4Items, setColumn4Items] = useState([]);
    const [column5Items, setColumn5Items] = useState([]);

    const [colum1Count, setcolum1Count] = useState(0);
    const [colum2Count, setcolum2Count] = useState(0);
    const [colum3Count, setcolum3Count] = useState(0);
    const [colum4Count, setcolum4Count] = useState(0);
    const [colum5Count, setcolum5Count] = useState(0);

    useEffect(() => {
        const socket = io('http://localhost:3001')
        setSocket(socket)
        socket.on('connect', () => {
          socket.emit('cardRender', {url: 'http://10.86.32.44:80/api-moinhos-production/public/api/moinhos', token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4wLjg1OjUwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjgyMzgwNDIzLCJleHAiOjE2ODUwMDg0MjMsIm5iZiI6MTY4MjM4MDQyMywianRpIjoiWVFaSEp2cmRpdHJsRFFydSIsInN1YiI6IjIiLCJwcnYiOiI0YTU2OGU0ZDM2NGEyMmRlY2FhYTJlMjNhM2Y3NDNmNzhhYWYxNTllIn0.itWbAmYSvB8NAmQ-jotwi6vxRrrV595uJurceYn2qA4'})
        })
    
        socket.on('disconnect', () => {
          console.log('disconnected')
        })
    
        socket.on('cardRender', (msg)=>{
          let message = JSON.parse(msg.dados)
          if(message)
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
        })
    
        return () => {
          socket.disconnect()
        }
      }, [])

    const onDragEnd = (result) => {
      if (!result.destination) {
        return;
      }

      console.log(result)

  
  
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


        axios.post('http://10.86.32.44:80/api-moinhos-production/public/api/moinhos/cancelar', {
            acess_number: item.acess_number,
            identificacao: 1,
            codigo_setor_exame:  item.codigo_setor_exame,
            data: item.hora_pedidoX,
        }, config).then(()=>{
            socket.emit('cardRender', {url: 'http://10.86.32.44:80/api-moinhos-production/public/api/moinhos', token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTAuMC4wLjg1OjUwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjgyMzgwNDIzLCJleHAiOjE2ODUwMDg0MjMsIm5iZiI6MTY4MjM4MDQyMywianRpIjoiWVFaSEp2cmRpdHJsRFFydSIsInN1YiI6IjIiLCJwcnYiOiI0YTU2OGU0ZDM2NGEyMmRlY2FhYTJlMjNhM2Y3NDNmNzhhYWYxNTllIn0.itWbAmYSvB8NAmQ-jotwi6vxRrrV595uJurceYn2qA4'})
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
                                    <div className={styles.nome}><span>{item.paciente}</span></div>
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
                                    <div className={styles.nome}><span>{item.paciente}</span></div>
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
                                    <div className={styles.nome}><span>{item.paciente}</span></div>
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
                                    <div className={styles.nome}><span>{item.paciente}</span></div>
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
                                    <div className={styles.nome}><span>{item.paciente}</span></div>
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