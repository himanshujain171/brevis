import React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Backdrop } from '@material-ui/core';
import StepStyle from './Step.module.css'
import Loader from '../Loader/Loader';
import io from 'socket.io-client'
import axios from 'axios';

const socket=io('http://localhost:5000',{transports:['websocket'],pingTimeout:3600000,pingInterval:180000});



class Step3 extends React.Component{

    state={
        disabled:'true',
        buttondisabled:'true',
        open:'true',
        scrape:''
    }
    

    handleOnClick=(e)=>{
        this.setState({open:false,disabled:false})

    }
    handleDownload = async() => {
    
      let res= await axios.get('/send/'+this.props.data.url.slice(32)+this.props.data.type,{responseType: 'blob'});
  
      let url = window.URL.createObjectURL(res.data);
      let a = document.createElement('a');
      a.href = url;
      a.download = 'brevis_notes2.zip';
      a.click();
    }
    setSocketListeners(){
        console.log("listening")
        socket.on('response1',(json_result)=>{
        console.log("in response")
        console.log(json_result);
        this.setState({
          scrape:json_result,
          disabled:false
        });
        socket.emit('event2','junkdata')
        }

        )
        socket.on('response2',(resp)=>{
          console.log(resp)
          this.setState({downloadresponse:true,
        buttondisabled:false})
          //document.getElementById('LoadingMessage').style.visibility = "hidden";
        })
        this.props.onScrapeContent(this.state.scrape)
    }

    componentDidMount(){
        socket.emit('event1',this.props.data)
        this.setSocketListeners()
    }
    render(){
        if(this.state.disabled){
            var googleList=null;
            var youtubeList=null;
        }
        else{
        const {google,youtube}=this.state.scrape;
        var googleList=google.map(element=>{
          return(
            <div key={element.linktopage}>
              <a href={element.linktopage} >{element.title}</a>
            </div>
          )
        })
        var youtubeList=youtube.map(element=>{
          return(
            <div key={element.linktopage}>
              <a href={element.linktopage}>{element.title}</a>
            </div>
          )
        })
    }
        return(
            <div>
                <Backdrop open={this.state.open} className={StepStyle.backdrop} onClick={this.handleOnClick}>
                    <Loader></Loader>
                </Backdrop>
                <Button variant="contained" className={StepStyle.Button} component="span" onClick={this.handleDownload} disabled={this.state.buttondisabled}>
                    Download
                </Button>
                <p></p>
                <Accordion style={{width:'40%',marginLeft:'32%',borderRadius:'10px'}} disabled={this.state.disabled}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Summary</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <p></p>
                <Accordion style={{width:'40%',marginLeft:'32%',borderRadius:'10px'}} disabled={this.state.disabled}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Video Links</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        {youtubeList}
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <p></p>
                <Accordion style={{width:'40%',marginLeft:'32%',borderRadius:'10px'}} disabled={this.state.disabled}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Article Links</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        {googleList}
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <p></p>
            </div>
        )
    }
}

export default Step3