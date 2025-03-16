import React from "react";

import { getSettings, updateSettings } from "../../services/settingsServices";
import Loader from "../../commons/Loader";
import { toast } from "../../actions/toastActions";
import ManualSlot from "../ManualSlot/Index";

const styles = {
  teamCard: {
    display: "inline-block",
    marginRight: 20,
    marginBottom: 20,
    padding: 20,
    width: "100%",
    borderRadius: 3,
    border: "2px solid rgba(0, 0, 0, .1)",
    color: "inherit",
    boxShadow: "0px 5px 20px -4px rgba(0, 0, 0, .1)",
    transition: "box-shadow .2s ease",
    ":hover": {
      color: "inherit",
      boxShadow: "0px 5px 50px -4px rgba(0, 0, 0, .1)",
    }
  },
};


export default class Settings extends React.Component {
  state = {
    title: "",
    enableTeamEdit: false,
  };



  handleSave() {
    const data = { title: this.state.title, editTeamEnabled: this.state.enableTeamEdit };
    console.log(data)
    updateSettings(data).then(data => {
      toast("Updated ✔")
    });
  }

  componentWillMount() {
    getSettings().then(settings => {
      console.log(settings);
      if (settings) {
        this.setState({
          title: settings.title || "",
          enableTeamEdit: settings.editTeamEnabled || false,
        })
      }
    }).catch((err) => {
      console.error(err)
    })
  }



  render = () => (
    <div className="flex w-full items-center  flex-col gap-4">
      <div className=" w-[400px] bg-zinc-50 border p-4 rounded-md ">
        <h2 className="mucapp">Settings</h2>
        <div className="flex flex-col gap-4 p-6">
          <div className="input-group gap-1 flex flex-col">
            <label htmlFor="title" className=" text-md">Title</label>
            <input className=" border rounded-sm h-10 py-2 px-1 text-base" type="text" id="title" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value })} />
          </div>

          <div className="input-group gap-2 flex">
            <label htmlFor="enable_team_edit" className=" text-md">Enable Team Edit</label>
            <input className=" border rounded-sm w-[20px]" type="checkbox" id="enable_team_edit" value={this.state.enableTeamEdit} onChange={(e) => this.setState({ enableTeamEdit: e.target.checked })} checked={this.state.enableTeamEdit} />
          </div>

          <button className="mucapp mt-4 w-[200px]" onClick={this.handleSave.bind(this)}>Save</button>
        </div>

      </div>
      <div className=" w-[400px] bg-zinc-50 border p-4 rounded-md ">
        <h2 className="mucapp">Manual Slotting</h2>
        <ManualSlot />


      </div>
    </div>
  );
};
