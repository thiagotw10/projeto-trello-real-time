import styles from "@/styles/kaban.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";

const DetalhesModal = ({ dados, onClose }) => {
 

  return (
    <div className={styles.modals}>
      <div className="modal" style={{display: 'block', paddingRight: '17px'}}  tabIndex="-1" id="modalForm">
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content overflow-hidden">
          <div className="modal-header">
            <h5 className="modal-title">Detalhes do Exame</h5>
            <a
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              
              <AiOutlineClose onClick={()=>{onClose()}} />
            </a>
          </div>
          <div className="modal-body js-dados-preview overflow-auto">
            <div className="row mb-3 d-flex justify-content-between">
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Número do Prontuário
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.prontuario ? dados.prontuario : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="form-group col-6 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control"
                      disabled
                      value={dados.paciente ? dados.paciente : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Número do Atendimento
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.atendimento ? dados.atendimento : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="form-group col-6 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Número do Pedido
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.pedido_exame ? dados.pedido_exame : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Data de Nascimento
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.data_nasc ? dados.data_nasc : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="form-group col-6 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Exame
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.descricao_exame ? dados.descricao_exame : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Data e Hora do pedido
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.data_movimentacao ? dados.data_movimentacao : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Access Number
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.acess_number ? dados.acess_number : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Origem
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.setor ? dados.setor : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="form-group col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Leito
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.leito ? dados.leito : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="col-6 m-0">
                <div className="form-control-wrap">
                  <label className="form-label m-0" htmlFor="outlined-normal">
                    Tipo de Isolamento
                  </label>
                  <input
                    type="text"
                    className="form-control form-control form-control-outlined"
                    disabled
                    value={dados.tipo_isolamento ? dados.tipo_isolamento : ''}
                    id="outlined-normal"
                  />
                </div>
              </div>
              <div className="col-6 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Prestador
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.prestador ? dados.prestador : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="col-4 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Setor Solicitante
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.setor ? dados.setor : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
              <div className="col-4 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Observação do Item
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.observacao_item ? dados.observacao_item : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
              <div className="col-4 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Veículo
                    </label>
                    <input
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.veiculo ? dados.veiculo : ''}
                      id="outlined-normal"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3 d-flex justify-content-between">
              <div className="col-6 m-0">
                <div className="form-group">
                  <div className="form-control-wrap">
                    <label className="form-label m-0" htmlFor="outlined-normal">
                      Justificativa do Item
                    </label>
                    <textarea
                      type="text"
                      className="form-control form-control form-control-outlined"
                      disabled
                      value={dados.justificativa_item ? dados.justificativa_item : ''}
                      id="outlined-normal"
                    >
                      
                    </textarea>
                  </div>
                </div>
              </div>
              <div className="col-6 m-0 d-flex flex-column">
                <div className="col-12 mb-4">
                  <div className="form-group">
                    <div className="form-control-wrap">
                      <label className="form-label m-0" htmlFor="outlined-normal">
                        Sala de Exame
                      </label>
                      <input
                        type="text"
                        className="form-control form-control form-control-outlined"
                        disabled
                        value={dados.sala ? dados.sala : ''}
                        id="outlined-normal"
                      />
                    </div>
                  </div>
                </div>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DetalhesModal;
