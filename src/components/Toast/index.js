import React,{ Component } from "react";
import './style.css';
import toastReducer from '../../reducers/toastReducer';
import {FiInfo} from 'react-icons/fi'

export default class Toast extends Component{
    state={
        message:null,
        timer:null,
        animation:'none'
    }
    show(){
        this.setState({
            animation: "fadeOut 3s linear 0s 1 forwards"
        })
        setTimeout(()=>{
            this.setState({
                animation: "none"
            })
        },3000);
        
    }
    componentDidMount(){
        toastReducer.subscribe(()=>{
            this.setState({...toastReducer.getState()},()=>{
                this.show();
            });
        })
    }
    render(){
        return(
            <div css={{
                position:"fixed",
                top:"-50%",
                width:"100%",
                animation:this.state.animation
            }}
            className="no-print"
            >
                <div css={{
                    background: "#fff",
                    color:"#900",
                    maxWidth: 300,                    
                    zIndex: 1000,
                    fontSize: 16,
                    textAlign: "center",
                    padding: 10,
                    margin:"auto",
                    boxShadow: "0px 0px 100px #ddd"
                }}>
                    <FiInfo/> 
                    <span style={{marginLeft:2}}>
                        {this.state.message}
                    </span>
                </div>
            </div>
        );
    }
}