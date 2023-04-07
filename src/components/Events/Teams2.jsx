import React from "react";
import { Link } from "gatsby";

import { getTeams2, getTeams2WithMembers } from "../../services/eventService";
import eventService from "../../services/events"
import Loader from "../../commons/Loader";
import { getParticipants } from "../../services/collegeServices";


const styles = {
  teamCard: {
    display: "flex",
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    ":hover": {
      color: "inherit",
    }
  },
};

const TeamCard = (props) => {
    if(props.team){
        return (
            <tr style={{textAlign:"left", border:"1px solid black"}}>
              <td style={{border:"1px solid black", padding: "10px"}}>{props.team.college.name} </td>
              <td style={{border:"1px solid black", padding: "10px"}}>{props.team.name}</td>
              <td className="members" style={{display:"flex", padding: "10px"}}>
                  {props.team.members.map((member)=>{
                    return (<div className="member" style={{margin:"0px 10px",}}>
                        <div className="member-name">{member.name}</div>
                        <div className="member-regno" style={{fontSize:"0.8em", color:"grey"}}>{(member.registrationID)}</div>
                    </div>)
                  })}
              </td>
            </tr>
          );
    }else
    {
        return <>Loading teams...</>
    }
}

export default class Teams extends React.Component {
  state = {
    colleges: [],
    teams: {},
    event: null,
    loaded: false,
  };


  async componentWillMount() {
    let teams = await getTeams2WithMembers(this.props.event);
    let event = await eventService.get(this.props.event);
    // console.log(teams)
    teams = teams.map(team => {
        
        return {
            name: team.name,
            id: team.id,
            event: team.event,
            college: team.college,
            members: team.members
          };
    });

    this.setState({ teams, loaded: true, event});
    /*
    let sortedTeams = {};
    let colleges = Array.from(new Set(teams.map(team => team.event.name)));
    for (let event of events) {
      sortedTeams[event] = teams.filter(team => team.event.name === event);
    }

    this.setState({
      events,
      teams: sortedTeams,
    });*/


  }

  tableStyle = ()=>{
    return (`
        <style>
            body{
                font-family: sans-serif;
            }
            table{
                border-collapse: collapse;
            }
            tr{
                border: 2px solid black !important;
            }
            @media print{@page {size: landscape}}
        </style>
    `)
  }

  printHandler(){
    
        if(window)  {
            // console.log("Print")
            const printWindow = window.open("","","width=2480,height=3508");
            printWindow.document.write("<html><head>");
            console.log(this.tableStyle())
            printWindow.document.write(this.tableStyle());
            printWindow.document.write("</head><body>");
            printWindow.document.write("<h1>"+this.state.event.name+"</h1>")
            const table = document.querySelector("#team-list").innerHTML;
            printWindow.document.write(table);
            printWindow.document.write("</body></html>");
            // printWindow.close();
            printWindow.print();
            printWindow.close();

        }
  }

  render = () => {
    return (
      <div>
        <div>
          <h2 className="mucapp">Teams</h2>
          <button className="mucapp" onClick={this.printHandler.bind(this)}>Generate PDF</button>
        </div>
        <div id="team-list">
        <table  cellPadding={40}  style={{marginTop:"10px", border:"1px solid black"}}>
            <tbody>
                <tr style={{textAlign:"left", border:"1px solid black"}}>
                    <th style={{border:"1px solid black", padding: "10px"}}>College name</th>
                    <th style={{border:"1px solid black", padding: "10px"}}>Team name</th>
                    <th style={{border:"1px solid black", padding: "10px"}}>Members</th>
                </tr>
            {this.state.loaded ? <>
                {this.state.teams.length ? <>
                {
                    this.state.teams.map((team, key) =>
                    <TeamCard key={key} team={team} />
                    )
                }
                </> : "No teams have registered yet."}
            </> : <Loader />}
            </tbody>
        </table>
        </div>
      </div>
    );
  }
};
