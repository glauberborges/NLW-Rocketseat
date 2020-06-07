import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import logo from "../../assets/logo.svg";
import {Link, useHistory} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";
import InputMask from 'react-input-mask';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from "./../../services/api";
import Dropzone from "./../../components/Dropzone";
import axio from 'axios';
import './style.css'

interface Items {
    id: number;
    title: string;
    image_url: string;
}

interface Uf {
    sigla: string;
}

interface City {
    nome: string;
}


const CreatePoint = () => {
    const [items ,setItems]                         = useState<Items[]>([]);
    const [ufs ,setUfs]                             = useState<string[]>([]);
    const [selectedUF ,setSelectedUF]               = useState<string>('');
    const [selectedCity ,setSelectedCity]           = useState<string>('');
    const [cities ,setCities]                       = useState<string[]>([]);
    const [initilPosition ,setinitilPosition]       = useState<[number,number]>([0,0]);
    const [selectedPosition ,setSelectedPosition]   = useState<[number,number]>(initilPosition);
    const [formData ,setFormData]                   = useState({
        name: '',
        email: '',
        whatsapp: '',
        number: '',
    });
    const [selectedItems ,setSelectedItems]     = useState<number[]>([]);
    const [selectedFile ,setSelectedFile]       = useState<File>();

    const history = useHistory();

    useEffect(function () {
        api.get('/items').then(function (response) {
            setItems(response.data)
        })
    },[]);

    useEffect(function () {
        axio.get<Uf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(function (response) {
            const ufInitials = response.data.map(function (uf) {
                return uf.sigla
            })

          setUfs(ufInitials)

        })
    },[]);

    useEffect(function () {
        if (selectedUF) {
            axio.get<City[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+selectedUF+'/municipios').then(function (response) {
                const cityNames = response.data.map(function (city) {
                    return city.nome
                })

                setCities(cityNames)
            })
        }

    },[selectedUF]);

    useEffect(function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            setinitilPosition([
                position.coords.latitude,
                position.coords.longitude
            ]);
        })
    },[]);
    
    function handleSelectUf(event:ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUF(uf)
    }

    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleGetValueInput(event:ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSelectItems(id: number) {

        if (selectedItems.includes(id)){
            setSelectedItems(
                selectedItems.filter((item)=>(item !== id))
            )
        }else{
            setSelectedItems([
                ...selectedItems,
                id
            ])
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const {name, email, whatsapp, number} =  formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('number', number);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile){
            data.append('image', selectedFile);
        }


//         const data = {
//             selectedFile,
// data.append('name', name);
// data.append('email', email);
// data.append('whatsapp', whatsapp);
// data.append('uf', uf);
// data.append('city', city);
// data.append('number', number);
// data.append('latitude', latitude);
// data.append('longitude', longitude);
// data.append('items', items);
//         };

        await api.post('/points', data);

        alert("Cadastro efetuado com sucesso.")

        history.push('/')

    }

    return (
	  <div id='page-create-point'>
          <header>
              <img src={logo} alt="Logo"/>
              <Link to='/'>
                  <FiArrowLeft/>
                  Voltar para Home
              </Link>

          </header>

          <main>
              <form onSubmit={handleSubmit}>
                  <h1>Cadastro do <br/>ponto de coleta</h1>

                  <Dropzone onFileUploaded={setSelectedFile}/>

                  <fieldset>
                      <legend> <h2>Dados</h2></legend>

                      <div className="field">
                          <label htmlFor="name">Nome da entidade</label>
                          <input type="text" name='name' id='name' onBlur={handleGetValueInput}/>
                      </div>

                      <div className="field-group">
                          <div className="field">
                              <label htmlFor="email">E-mail</label>
                              <input type="email" name='email' id='email' onBlur={handleGetValueInput}/>
                          </div>

                          <div className="field">
                              <label htmlFor="whatsapp">WhatsApp</label>

                              <input type="text" name='whatsapp' id='whatsapp' onBlur={handleGetValueInput}/>

                              {/*<InputMask mask="+55 (99) 99999-9999" type="text" name='whatsapp' id='whatsapp' onBlur={handleGetValueInput}></InputMask>*/}

                          </div>

                      </div>

                  </fieldset>

                  <fieldset>
                      <legend>
                          <h2>Endereço</h2>
                          <span>Selecione um ou mais ítens abaixo</span>
                      </legend>

                      <Map center={initilPosition} zoom={12} onClick={handleMapClick}>
                          <TileLayer
                              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          <Marker position={selectedPosition}>
                              <Popup>
                                  A pretty CSS3 popup. <br /> Easily customizable.
                              </Popup>
                          </Marker>
                      </Map>


                      <div className="field-group">

                          <div className="field">
                              <label htmlFor="uf">UF</label>
                              <select name='uf' id='uf' onChange={handleSelectUf}>
                                  <option value="">Selecione</option>
                                  {ufs.map(function (uf) {
                                      return (
                                          <option key={uf} value={uf}>{uf}</option>
                                      );
                                  })}

                              </select>
                          </div>

                          <div className="field">
                              <label htmlFor="city">Cidade</label>
                              <select name='city' id='city'  onChange={handleSelectCity}>>
                                  {cities.map(function (city) {
                                      return (
                                          <option key={city} value={city}>{city}</option>
                                      );
                                  })}
                              </select>
                          </div>

                          <div className="field">
                              <label htmlFor="number">Número</label>
                              <input type="number" name='number' id='number' onBlur={handleGetValueInput}/>
                          </div>

                      </div>
                  </fieldset>

                  <fieldset>
                      <legend>
                          <h2>Ítens de coleta</h2>
                          <span>Selecione um ou mais ítens abaixo</span>
                      </legend>

                      <ul className="items-grid">
                          {items.map(function (item) {
                              return (
                                  <li key={item.id} onClick={() => handleSelectItems(item.id)} className={selectedItems.includes(item.id)  ? 'selected' : '' }>
                                      <img src={item.image_url} alt={item.title}/>
                                      <span>{item.title}</span>
                                  </li>
                              )
                          })}

                      </ul>

                  </fieldset>

                  <button>
                      Cadastrar ponto de Coleta
                  </button>

              </form>
          </main>
	  </div>
  );
}

export default CreatePoint;
