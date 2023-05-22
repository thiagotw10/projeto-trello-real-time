import React, { useState } from 'react';

const SelectNome = ({ optionsNome, onMatheus, optionsSala, optionsSetor }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValueSala, setSelectedValueSala] = useState('');
  const [selectedValueSetor, setSelectedValueSetor] = useState('');

  const optionArrayNome = Object.entries(optionsNome).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const optionArraySala = Object.entries(optionsSala).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  const optionArraySetor = Object.entries(optionsSetor).map(([key, value]) => ({
    value: key,
    label: value,
  }));


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setSelectedValueSala('')
    setSelectedValueSetor('')
    onMatheus({nome: event.target.value})
  };

  const handleChangeSala = (event) => {
    setSelectedValueSala(event.target.value);
    setSelectedValue('')
    setSelectedValueSetor('')
    onMatheus({sala: event.target.value})
  };

  const handleChangeSetor = (event) => {
    setSelectedValueSetor(event.target.value);
    setSelectedValue('')
    setSelectedValueSala('')
    onMatheus({setor: event.target.value})
  };

  return (
    <div style={{display: 'flex'}}>
      <select value={selectedValue} onChange={handleChange}>
        <option value="">Selecione uma opção</option>
        {optionArrayNome.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {/* <p>Você selecionou: {selectedValue}</p> */}

      <select value={selectedValueSala} onChange={handleChangeSala}>
        <option value="">Selecione uma opção</option>
        {optionArraySala.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {/* <p>Você selecionou: {selectedValueSala}</p> */}

      <select value={selectedValueSetor}  onChange={handleChangeSetor}>
        <option value="">Selecione uma opção</option>
        {optionArraySetor.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      {/* <p>Você selecionou: {selectedValueSetor}</p> */}
    </div>
  );
};

export default SelectNome;
