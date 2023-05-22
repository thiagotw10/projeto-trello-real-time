import React, { useState } from "react";
import styles from "@/styles/kaban.module.css";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import ActivityLoader from "./ActivityLoader";
import url from "./url";


const FormAgendar = ({onFechar, dados}) => {

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    data: "",
    hora: "",
  });

  const onValor = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    
  };


  function agendar(e){
    e.preventDefault();
    if(form.data == '' || form.hora == ''){
      return
    }
    setLoading(true)
    var dataOriginal = form.data;
    var data = new Date(dataOriginal);
    var dia = data.getDate();
    var mes = (data.getMonth() + 1).toString().padStart(2, "0");
    var ano = data.getFullYear();
    var dataFormatada = dia + "/" + mes + "/" + ano;

    let imagem = 'cadeira-de-rodas-preto.png'
        axios.post(url().url + '/moinhos/agendar', {
                acess_number: dados.acess_number,
                data_agendamento: dataFormatada,
                hora_agendamento: form.hora,
                imagem_cadeira: imagem,
                user: 'thiago'
        }, url().config).then(()=>{
            onFechar()
        }).catch((error)=>{ console.log(error)})

  }

  return (
    <>
      <div className={styles.modals}>
        <div className="modal-dialog" role="document" style={{backgroundColor: "white", height: '300px', width: '500px', borderRadius: '10px'}}>
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title">Agendar horário de exame</h5>
                <small>
                  Informe a data e a hora que o exame será realizado.
                </small>
              </div>
              <a id="fecharModalAgendar">
              <AiOutlineClose onClick={()=>{onFechar()}} />
              </a>
            </div>
            <div className="modal-body">
              <form
                name="form"
                id="agendarHorario"
                className="form-validate is-alter"
                onSubmit={agendar}
              >
                <div className="form-group d-flex flex-column">
                  <div className="col-lg-12 col-sm-12 m-0">
                    <div className="form-group">
                      <div className="form-control-wrap">
                        <label className="form-label m-0" htmlFor="outlined-normal">
                          Data de Realização
                        </label>
                        <input
                          type="date"
                          name="data"
                          value={form.data}
                          className="form-control form-control form-control js-mask-data"
                          id="outlined-normal js-mask-data"
                          onChange={(e)=> onValor(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group d-flex flex-column">
                  <div className="col-lg-12 col-sm-12 m-0">
                    <div className="form-group">
                      <div className="form-control-wrap">
                        <label className="form-label m-0" htmlFor="outlined-normal">
                          Hora de Realização
                        </label>
                        <input
                          type="time"
                          name="hora"
                          value={form.hora}
                          className="form-control form-control form-control js-mask-hora"
                          id="outlined-normal js-mask-hora"
                          placeholder="12:00"
                          onChange={(e)=> onValor(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {loading ? <ActivityLoader/> : <button
                    type="submit"
                    className="btn btn-dim btn-outline-primary"
                    id="marcar-horario"
                  >
                    Agendar
                  </button>}
                 
                  <button
                    className="btn btn-dim btn-outline-primary d-none"
                    id="marcar-horario-carregando"
                    type="button"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span> Agendando horário... </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormAgendar;
