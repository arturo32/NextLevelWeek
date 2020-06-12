import React, { useState, useEffect, useRef, ChangeEvent, FormEvent} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent, LatLngExpression} from 'leaflet'
import api from '../../services/api';
import axios from 'axios';
import Dropzone from '../../components/Dropzone/index'

import './styles.css';
import logo from '../../assets/logo.svg'

const CreatePoint = () => {

	interface Item{
		id: number;
		title: string;
		image_url: string;
	}

	interface UF{
		sigla: string;
		nome: string;
	}

	interface City{
		nome: string;
		id: number;
	}

	const [items, setItems] = useState<Item[]>([]);
	
	const [ufs, setUfs] = useState<UF[]>([]);
	const [selectedUf, setSelectedUf] = useState<string>("");
	const [cities, setCities] = useState<City[]>([]);
	const [selectedCity, setSelectedCity] = useState<string>("");
	const [selectedStreet, setSelectedStreet] = useState<string>("");
	
	const [selectedPosition, setSelectedPosition] = useState<LatLngExpression>([-15.78168164763942, -47.8948974609375]);
	const [currentZoom, setCurrentZoom] = useState<number>(3);

	const [selectedFile, setSelectedFile] = useState<File>();
	
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: '',
		street: '',
		houseNumber: ''
	});
	const [selectedItems, setSelectedItems] = useState<number[]>([]);

	const [submitScreen, setSubmitScreen] = useState<boolean>(false);
	
	//Function to be called when the component is mounted
	useEffect( () => {
		api.get('items').then(response =>{
			setItems(response.data);	
		});
	}, []);


	const history = useHistory();

	//Function to be called when the component is mounted
	useEffect( () => {

		//GET request that gives an array with all Brazilian states
		axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
			.then(response => {
				setUfs(response.data);
			});
	}, []);

	//Function to be called when selectedUf is changed	
	useEffect( () => {
		if(selectedUf !== ""){

			//GET request that gives an array with all cities of a given state
			axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`)
				.then(response => {
					setCities(response.data);	
				});
		}
	}, [selectedUf]);

	/*useRef is used here because it allows the zoomAnimation.current
	to persist for the full lifetime of this component*/
	const zoomAnimation = useRef<any>();

	//Function to be called when selectedCity is changed
	useEffect( () => {	
		if(selectedCity !== ""){

			//GET request that gives the coordinates for a given city and state
			axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${selectedCity}%2C+${selectedUf}`)
				.then(res => {

					setSelectedPosition([res.data[0].lat, res.data[0].lon]);
		
					if(currentZoom < 11){

						/*After 200 milliseconds (waiting the map updates its center) 
						the currentZoom increases 1 unit each 100 milliseconds until
						it becomes bigger or equal 11 (useEffect hook below)*/
						setTimeout( () => zoomAnimation.current = setInterval(() => setCurrentZoom(zoom => zoom+1), 100), 200);
					}
				}).catch( (error) => console.log(error));

			return () => {
				clearInterval(zoomAnimation.current);
			}

		}
	}, [selectedCity, selectedUf]);

	//Hook used to stop the increase of currentZoom
	useEffect( () => {
		if(currentZoom >= 11){
			clearInterval(zoomAnimation.current);
		}
	}, [currentZoom]);


	function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>){
		setSelectedUf(e.target.value);
	}
		
	function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>){
		setSelectedCity(e.target.value);
	}

	function handleMapClick(e: LeafletMouseEvent){
		setSelectedPosition([e.latlng.lat, e.latlng.lng]);

		//GET request that gives an address based in given coordinates
		//One second delay is set to respect the Nominatim usage policy
		setTimeout( () => {
			axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
				.then(res => {
					if(res.data.address){
						const clickedUf = ufs.find(uf => uf.nome  === res.data.address.state);
						if(clickedUf){
							setSelectedUf(clickedUf.sigla);
						}
				
					
						
						const clickedCity = cities.find(city => {
							if(res.data.address.city){
								return city.nome === res.data.address.city;
							}
							else if(res.data.address.town){
								return city.nome === res.data.address.town;
							}
							else{
								return city.nome === res.data.address.village;
							}
						
						});
						
						

						if(clickedCity){
							setSelectedCity(clickedCity.nome);

							const clickedStreet = res.data.address.road;
							if(clickedStreet){
								setSelectedStreet(clickedStreet);
							}
						}


					}
				});
		}, 1000);
		

	}

	function handleZoom(e: LeafletMouseEvent){ 
		setCurrentZoom(e.target._zoom); 
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>){
		const {name, value} = e.target;
		setFormData({...formData, [name]: value});
	}

	function handleItemClick(id: number){
		if(selectedItems.includes(id)){
			
			setSelectedItems(selectedItems.filter(item => item !== id));
		}
		else{
			setSelectedItems([...selectedItems, id]);
		}
	}

	async function handleSubmit(e: FormEvent){
		e.preventDefault();

		const {name, email, whatsapp} = formData;  
		const [latitude, longitude] = selectedPosition as number[];
		const city = selectedCity;
		const uf = selectedUf;
		const items = selectedItems;

		const data = new FormData();	

		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('city', city);
		data.append('uf', uf);
		data.append('items', items.join(','));
		if(selectedFile){
		 	data.append('image', selectedFile);
		}
	

		console.log(data);
		await api.post('points', data);

		//Show success submit screen
		setSubmitScreen(true);

		//Move to the home page
		setTimeout(() => history.push('/'), 2500);

	}

	return (
		
			<div id="page-create-point">
							<header>
					<img src={logo} alt="Ecoleta"/>
					<Link to="/">
						<FiArrowLeft />
						Voltar para o início
					</Link>
				</header>

		
			
				<form onSubmit={handleSubmit}>
					<h1>Cadastro do <br/> ponto de coleta</h1>

					<Dropzone onFileUploaded={setSelectedFile} />

					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>
						<div className="field">
							<label htmlFor="name">Nome da entidade</label>
							<input type="text" name="name" id="name" onChange={handleInputChange} required/>
						</div>

						<div className="field-group">
							<div className="field">
								<label htmlFor="email">Email</label>
								<input type="email" name="email" id="email" onChange={handleInputChange} required/>
							</div>
							<div className="field">
								<label htmlFor="whatsapp">Whatsapp</label>
								<input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />
							</div>
						</div>



					</fieldset>
					<fieldset>
						<legend>
							<h2>Endereço</h2>
							<span>Selecione o endereço no mapa</span>
						</legend>
						
						<img src="" alt=""/>
						<Map center={selectedPosition} zoom={currentZoom}  onClick={handleMapClick} onzoomend={handleZoom} >
							<TileLayer 
								attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<Marker position={selectedPosition}></Marker>
						</Map>

						<div className="field-group">
							<div className="field">
								<label htmlFor="uf">Estado (UF)</label>
								<select name="uf" id="uf" onChange={handleSelectedUf} value={selectedUf} required>
									<option value="0">Selecione um estado</option>
									{ufs.map(uf => (
										<option key={uf.sigla} value={uf.sigla} >{uf.nome}</option>
									))}
							
								</select>
							</div>	
							<div className="field">
								<label htmlFor="city">Cidade</label>
								<select name="city" id="city" onChange={handleSelectedCity} value={selectedCity} required>
									<option value="0">Selecione uma cidade</option>
									{cities.map(city => (
										<option key={city.id} value={city.nome}>{city.nome}</option>
									))}
								</select>
							</div>
						</div>

						<div className="field-group-street-number">
							<div className="field street">
								<label htmlFor="street">Rua</label>
								<input type="text" name="street" id="street" onChange={handleInputChange} value={selectedStreet} required/>
							</div>
							<div className="field number">
								<label htmlFor="houseNumber">Número</label>
								<input type="text" name="houseNumber" id="houseNumber" onChange={handleInputChange} required/>
							</div>
						</div>

					</fieldset>
					<fieldset>
						<legend>
							<h2>Itens de coleta</h2>
							<span>Selecione um ou mas itens abaixo</span>
						</legend>
						<ul className="items-grid">
							{items.map(item => (
								<li 
									key={item.id} 
									onClick={() => handleItemClick(item.id)} 
									className={ selectedItems.includes(item.id)? 'selected' : ''}	
								>
									<img src={item.image_url} alt={item.title}/>
									<span>{item.title}</span>
								</li>
							))}
							
						</ul>
					</fieldset>
					<button type="submit">
						Cadastrar ponto de coleta
					</button>
				</form>
				<div  id="submit-screen" className={submitScreen? "show" : ""} >
					<div id="submit-screen-text">
						<FiCheckCircle />
						<p>Cadastro Concluído!</p>
					</div>
				</div>

			</div>
		
	)
}


export default CreatePoint;