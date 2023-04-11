import { Link } from "gatsby";
import React from "react";
import notificationService from "../../services/notifications";
import { getUser } from "../../services/userServices";
import moment from 'moment'
import { Button } from "../../commons/Form";
import { toast } from "../../actions/toastActions";
import Dialog from "../../commons/Dialog";

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wishTime: "Morning",
      date: moment().format("YYYY-MM-DD"),
      email: true,
      day: 1,
      whatsapp: true,
      push: true,
      sms: true,
      log: [],
      showDialog: false
    }
  }

  componentWillMount() {
    this.getLogs();
  }

  getLogs = async () => {
    let log = await notificationService.getLog();
    log.sort((a, b) => b.timestamp - a.timestamp)
    this.setState({ log })
  }

  sendToAllCoOrdinators = async () => {
    let { wishTime, date, email, day, whatsapp, push, sms } = this.state;
    this.setState({ showDialog: false })
    await notificationService.sendToAllCoOrdinators({ wishTime, date, email, day, whatsapp, push, sms });
    toast("Notification sent")
    this.getLogs();
  }

  sendToMe = async () => {
    let { wishTime, date, email, day, whatsapp, push, sms } = this.state;
    await notificationService.sendToMe({ wishTime, date, email, day, whatsapp, push, sms });
    toast("Notification sent")
    this.getLogs();
  }


  render = () => (
    <div>
      <h1>Notifications</h1>

      <h3>Message</h3>
      <div>
        <pre className="bg-gray-300 p-5 rounded-lg">
          <i>This is a message from MAHE CCC.</i><br />
          Good <select defaultValue={this.state.wishTime} onChange={(e) => this.setState({ wishTime: e.target.value })} className="mr-5">
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select><input value={getUser().name} disabled />,<br />
          <b>Welcome to UTSAV! Day <input type="number" min={1} defaultValue={this.state.day} onChange={(e) => this.setState({ day: e.target.value })} className="w-10" /> - <input type="date" onChange={(e) => this.setState({ date: e.target.value })} defaultValue={this.state.date} /></b><br />
          We are sending this message to remind you of all the events that's going to take place today.<br />
          Please ensure all participants are at the venue 15 mins before the event starts.<br />
          <br />
          Please click on the link to see today's events:<br />
          <a href={`https://manipalutsav.com/events/public?date=${this.state.date}`}>https://manipalutsav.com/events/public?date={this.state.date}</a><br />
        </pre>
      </div>
      <div className="flex flex-col m-2 ml-5 ">
        <label for="email"><input type="checkbox" id="email" onChange={(e) => this.setState({ email: e.target.checked })} defaultChecked={true} /> Email</label>
        <label for="whatsapp"><input type="checkbox" id="whatsapp" onChange={(e) => this.setState({ whatsapp: e.target.checked })} value={this.state.whatsapp} defaultChecked={true} /> Whatsapp</label>
        <label for="sms"><input type="checkbox" id="sms" onChange={(e) => this.setState({ sms: e.target.checked })} value={this.state.sms} defaultChecked={true} /> SMS</label>
        <label for="push"><input type="checkbox" id="push" onChange={(e) => this.setState({ push: e.target.checked })} value={this.state.push} defaultChecked={true} /> Push Notifications</label>

      </div>
      <Button onClick={() => this.setState({ showDialog: true })}>Send reminder to all co-ordinations</Button>
      <Button onClick={this.sendToMe}>Send to me</Button>


      <table className="table">
        <thead className="z-0">
          <tr>
            <td>Time</td>
            <td style={{ width: "100px" }}>Message</td>
            <td>Author</td>
            <td>Whatsapp</td>
            <td>SMS</td>
            <td>Email</td>
            <td>Push</td>
          </tr>
        </thead>
        <tbody>
          {this.state.log.map(item => <tr>
            <td>{moment(item.timestamp).format("DD-MM-YYYY HH:mm:ss")}</td>
            <td style={{ whiteSpace: "pre-line" }}>{item.message}</td>
            <td>{item.author.email}</td>
            <td>{item.whatsappCount}</td>
          </tr>)}
        </tbody>
      </table>
      <Dialog
        title="Confirming your action"
        body={<>Are you sure you want to send this message to all co-ordinations? Action cannot be undone.</>}
        positiveButton={{
          label: "Yes",
          handler: this.sendToAllCoOrdinators
        }}
        negativeButton={{
          label: "Cancel",
          handler: () => this.setState({ showDialog: false })
        }}
        show={this.state.showDialog}
      />
    </div>
  );
};
