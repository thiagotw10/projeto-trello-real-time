import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/kaban.module.css";
import { io } from 'socket.io-client'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

export default function Kaban() {
    const [socket, setSocket] = useState(null);
    const [items, setitems] = useState([]);
    const [column2Items, setColumn2Items] = useState([]);
    const [column3Items, setColumn3Items] = useState([]);
    const [column4Items, setColumn4Items] = useState([]);
    const [column5Items, setColumn5Items] = useState([]);


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
          setitems(message)
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
                <h2>Column 1</h2>
                <Droppable droppableId="droppable1">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
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
                                {item.tarefa}
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
                <h2>Column 2</h2>
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column2Items.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
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
                                {item.tarefa}
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
                <h2>Column 3</h2>
                <Droppable droppableId="droppable3">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column3Items.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
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
                                {item.tarefa}
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
                <h2>Column 4</h2>
                <Droppable droppableId="droppable4">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column4Items.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
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
                                {item.tarefa}
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
                <h2>Column 5</h2>
                <Droppable droppableId="droppable5">
                    {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {column5Items.map((item, index) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
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
                                {item.tarefa}
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
          <div><Link href="/">Voltar</Link></div>
        </>
      );
    
}