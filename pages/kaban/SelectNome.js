import React, { useState } from 'react';

const SelectNome = ({ options, onMatheus }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const optionArray = Object.entries(options).map(([key, value]) => ({
    value: key,
    label: value,
  }));


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onMatheus(event.target.value)
  };

  return (
    <div>
      <select value={selectedValue} onChange={handleChange}>
        <option value="">Selecione uma opção</option>
        {optionArray.map((option) => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
      <p>Você selecionou: {selectedValue}</p>
    </div>
  );
};

export default SelectNome;
