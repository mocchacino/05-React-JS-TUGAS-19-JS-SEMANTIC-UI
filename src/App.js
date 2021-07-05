import React, {Component} from "react";
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'
import {
  Button,
  Grid,
  Form,
  Table,
  Header,
  Segment,
  Image,
} from 'semantic-ui-react'

const options = [
  { key: 'L', text: 'Laki-laki', value: 'laki-laki' },
  { key: 'P', text: 'Perempuan', value: 'perempuan' },
]

class App extends Component{
  constructor(props){
    super(props)
    this.state={
      dataApi:[],
      edit:false,
      dataPost:{
        id:0,
        nama_karyawan:'',
        jabatan:'',
        jenis_kelamin:'',
        tanggal_lahir:''
      }
    }
    this.handleRemove=this.handleRemove.bind(this)
    this.inputChange=this.inputChange.bind(this)
    this.onSubmitForm=this.onSubmitForm.bind(this)
    this.clearData=this.clearData.bind(this)
  }
  handleRemove(e){
    console.log(e.target.value)
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, {
      method:"DELETE"
    }).then(res => this.reloadData())
  }

  reloadData(){
    axios.get('http://localhost:3004/data-karyawan').then(
      res => {
        this.setState({
          dataApi:res.data
        })
      }
    )
  }

  clearData = () =>{
    let newdataPost = {...this.state.dataPost}
    newdataPost['id'] = ''
    newdataPost['nama_karyawan']=''
    newdataPost['jabatan']=''
    newdataPost['jenis_kelamin']=''
    newdataPost['tanggal_lahir']=''

    this.setState({
      dataPost: newdataPost
    })
  }

  inputChange(e, {name, value}){
    this.setState({ value })
    let newdataPost = {...this.state.dataPost}

    if(this.state.edit === false){
      newdataPost['id'] = new Date().getTime()
    }
    // newdataPost[e.target.name] = e.target.value
    newdataPost[name] = value

    this.setState({
      dataPost : newdataPost
    }, 
    () => console.log(this.state.dataPost))
  }

  onSubmitForm(){
    if(this.state.edit === false){
      axios
      .post(`http://localhost:3004/data-karyawan`, this.state.dataPost)
      .then ( () => {
          this.reloadData()
          this.clearData()
        }
      )
    }else{
      axios
      .put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost)
      .then ( () => {
          this.reloadData()
          this.clearData()
        }
      )
    }
  }

  getDataId = (e) =>{
    axios
    .get(`http://localhost:3004/data-karyawan/${e.target.value}`)
    .then(res => 
      this.setState({
        dataPost: res.data,
        edit: true
      })
    )
  }

  componentDidMount(){
    // fetch('https://jsonplaceholder.typicode.com/todos/1')
    //   .then(response => response.json())
    //   .then(res => {
    //     this.setState({
    //       dataApi:res
    //     })
    //   })
    this.reloadData()
    
  }
  render(){
    const {value} = this.state.dataPost.jenis_kelamin
    return(
      <div>
        <Grid>
          <Grid.Row></Grid.Row>
          <Grid.Row color='grey' verticalAlign='middle'>
            <Grid.Column width={1}></Grid.Column>

            <Grid.Column width={2}>
              <Header>
                <Image src='https://asset-niomic.s3-ap-southeast-1.amazonaws.com/logo-niomic-black-.png' size='massive' />
              </Header>
            </Grid.Column>
            
            <Grid.Column width={10}></Grid.Column>

            <Grid.Column width={3} contentAlign='left' >
              <Header as='h5' >
                <Image circular src='https://react.semantic-ui.com/images/avatar/large/patrick.png' size='small' verticalAlign='middle'/> 
                <span>Wiladhianty</span>
              </Header>
            </Grid.Column>
          
            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1}></Grid.Column>
            
            <Grid.Column width={14}>
              <Segment.Group>
                <Segment as='h5'>Form Data Karyawan</Segment>
                <Segment.Group>
                  <Segment>
                    <Form>
                      <Form.Group>
                        <Form.Input fluid label='Nama' type='text' name='nama_karyawan' placeholder='Masukkan Nama Karyawan' value={this.state.dataPost.nama_karyawan} onChange={this.inputChange} width={10}/>
                        {/* <Form.Input fluid label='Jenis Kelamin' type='text' name='jenis_kelamin' placeholder='Masukkan Jenis Kelamin' value={this.state.dataPost.jenis_kelamin} onChange={this.inputChange} width={6}/> */}
                          <Form.Select
                          fluid
                          name='jenis_kelamin'
                          label='Jenis Kelamin'
                          options={options}
                          placeholder='Masukkan Jenis Kelamin'
                          value={value}
                          onChange={this.inputChange}
                          width={6}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Input fluid label='Jabatan' type='text' name='jabatan' placeholder='Masukkan Jabatan' value={this.state.dataPost.jabatan} onChange={this.inputChange} width={10}/>
                        <Form.Input fluid label='Tanggal Lahir' type='date' name='tanggal_lahir' onChange={this.inputChange} value={this.state.dataPost.tanggal_lahir} width={6}/>
                      </Form.Group>
                      <Button fluid type='submit' onClick={this.onSubmitForm} primary>Save Data</Button>
                    </Form>
                  </Segment>
                </Segment.Group>
              
                <Segment>
                  <Table celled striped>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Nama</Table.HeaderCell>
                        <Table.HeaderCell>Jabatan</Table.HeaderCell>
                        <Table.HeaderCell>Jenis Kelamin</Table.HeaderCell>
                        <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.dataApi.map((dat, index)=>
                        {
                          return(
                            <Table.Row key={index}>
                              <Table.Cell>{index+1}</Table.Cell>
                              <Table.Cell>{dat.nama_karyawan}</Table.Cell>
                              <Table.Cell>{dat.jabatan}</Table.Cell>
                              <Table.Cell>{dat.jenis_kelamin}</Table.Cell>
                              <Table.Cell>{dat.tanggal_lahir}</Table.Cell>
                              <Table.Cell>
                                <Button value={dat.id} onClick={this.handleRemove} color='red'>Delete</Button>
                                <Button value={dat.id} onClick={this.getDataId} color='blue'>Edit</Button>
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                      </Table.Body>
                  </Table>
                </Segment>
              </Segment.Group>
            </Grid.Column>

            <Grid.Column width={1}></Grid.Column>
          </Grid.Row>

          
        </Grid>
      </div>
        
        
        

      
    )
  }
}
export default App;
