import React from "react";
import Select from "react-select";

import {
  addCoreVolunteer,
  getCoreVolunteers,
} from "../../services/volunteerService";
import { Input, Button } from "../../commons/Form";
import { getColleges } from "../../services/collegeServices";
import { toast } from "../../actions/toastActions";
import { Link } from "gatsby";

import certificateURL from "../../images/volunteer-certificate-core.png";
import JSZip from "jszip";
const sizes = [
  { value: "XS", label: "Extra Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
  { value: "XXL", label: "Extra Extra Large" },
];

class CoreVolunteer extends React.Component {
  ADD_VOLUNTEER = "Add";
  ADDING_VOLUNTEER = "Adding...";
  state = {
    buttonText: this.ADD_VOLUNTEER,
    name: "",
    registerNumber: "",
    phoneNumber: "",
    shirtSize: null,
    collegeId: null,
    colleges: [],
    volunteers: [],
    downloadButtonName: "Download Certificates",
  };
  constructor(props) {
    super(props);
    this.downloadAll = this.downloadAll.bind(this);
  }
  async downloadAll() {
    const list = Object.values(this.state.volunteers);

    let total = list.length;
    list.map((vol) => {
      vol.college = this.state.colleges.find(
        (clg) => clg.value == vol.collegeId 
      ).label;
      return vol;
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    const link = document.createElement("a");
    const result = [];
    for (let i = 0; i < total; i++) {
      image.src = certificateURL;
      const blob = await new Promise((resolve) => {
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          context.font = "bold 71px Blogger Sans";
          context.fillStyle = "#000000";
          context.textAlign = "center";
          context.fillText(list[i].name, canvas.width / 2, 725);
          context.font = "bold 60px Blogger Sans";

          // Breaking the lines if it is too big to fit
          const lines = [];
          if (list[i]?.college?.length > 50) {
            const sep = list[i].college.split(" ");

            let line = "";
            let j = 0;
            while (j < sep.length) {
              line += " " + sep[j];
              j++;
              if (line.length >= 35) {
                lines.push(line.trim());
                line = "";
              }
            }
            lines.push(line.trim());
          }

          if (lines.length > 1) {
            lines.map((ln, idx) => {
              context.fillText(
                ln,
                canvas.width / 2,
                1150 - (lines.length - idx) * 63
              );
            });
          } else {
            context.fillText(list[i].college, canvas.width / 2, 1050);
          }
          canvas.toBlob((blob) => {
            this.setState({
              downloadButtonName: `Processing ${Math.round((i / total) * 100)}%...`,
            });
            resolve(blob);
          }, "image/png");
        };
      });
      result.push({
        filename:
          list[i].name + " - " + list[i].college + " - " + "core" + ".png",
        blob,
      });
    }
    let zip = new JSZip();
    result.forEach((i) => {
      zip.folder(i.event).file(i.filename, i.blob);
    });
    this.setState({ downloadButtonName: `Zipping...` });
    zip.generateAsync({ type: "blob" }).then((content) => {
      link.download = "core-volunteers-cert";
      link.href = URL.createObjectURL(content);
      link.style.display = "none";
      document.body.append(link);
      link.click();
      link.remove();
      this.setState({ downloadButtonName: "Download Certificates" });
    });
  }
  componentWillMount() {
    this.getColleges();
    this.getVolunteers();
  }

  getColleges = async () => {
    let response = await getColleges();
    if (response.status === 200) {
      const colleges = response.data.map((college) => ({
        value: college.id,
        label: college.name + ", " + college.location,
      }));
      this.setState({ colleges });
    } else toast("An error occured while fetching colleges");
  };

  handleChange = (e) => {
    this.setState({
      [e.name]: e.value,
    });
  };

  addVolunteer = async () => {
    try {
      await this.setState({ buttonText: this.ADDING_VOLUNTEER });
      let {
        name,
        registerNumber,
        phoneNumber,
        shirtSize,
        collegeId,
      } = this.state;
      name = name.trim();
      if (!name || name.length === 0) throw Error("Please enter name.");
      if (!registerNumber || registerNumber.length === 0)
        throw Error("Please enter register number.");
      if (!registerNumber.match(/^\d{4,}$/))
        throw Error("Please enter valid register number.");
      if (!phoneNumber.match(/^\d{4,}$/))
        throw Error("Please enter valid register number.");
      if (!shirtSize || shirtSize.length === 0)
        throw Error("Please select shirt size.");
      if (!collegeId || collegeId.length === 0)
        throw Error("Please select the college.");

      let response = await addCoreVolunteer({
        name,
        registerNumber,
        phoneNumber,
        shirtSize,
        collegeId,
      });
      this.setState({
        buttonText: this.ADD_VOLUNTEER,
      });
      if (response.status !== 200)
        toast(response.message + ": " + response.data);
      this.getVolunteers();
      this.setState({ name: "", registerNumber: "", phoneNumber: "" });
    } catch (err) {
      toast(err.message);
      this.setState({ buttonText: this.ADD_VOLUNTEER });
    }
  };

  getVolunteers = async () => {
    const response = await getCoreVolunteers();
    if (response.status === 200) {
      const volunteers = response.data;
      this.setState({ volunteers });
    } else toast("Failed to fetch volunteers");
  };

  render() {
    return (
      <div>
        <div>
          <div>
            <h2 className="mucapp">Core Volunteers</h2>
            <button className="mucapp" onClick={this.downloadAll}>
              {this.state.downloadButtonName}
            </button>
          </div>
        </div>
        <div className="coreVolunteers">
          <table className="vtable">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Name</th>
                <th>Register Number</th>
                <th>Phone Number</th>
                <th>Shirt Size</th>
                <th>College</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td />
                <td>
                  <Input
                    onChange={this.handleChange}
                    autoComplete="off"
                    name={`name`}
                    type="text"
                    value={this.state.name}
                    placeholder="Enter Name"
                    required
                    styles={{ width: 300 }}
                    css={{
                      float: "left",
                    }}
                  />
                </td>
                <td>
                  <Input
                    onChange={this.handleChange}
                    autoComplete="off"
                    name={`registerNumber`}
                    type="number"
                    placeholder="Enter Register Number"
                    value={this.state.registerNumber}
                    required
                    styles={{ width: 300 }}
                    css={{
                      float: "left",
                    }}
                  />
                </td>
                <td>
                  <Input
                    onChange={this.handleChange}
                    autoComplete="off"
                    name={`phoneNumber`}
                    type="number"
                    placeholder="Enter Phone Number"
                    value={this.state.phoneNumber}
                    required
                    styles={{ width: 300 }}
                    css={{
                      float: "left",
                    }}
                  />
                </td>
                <td>
                  <Select
                    isSearchable={false}
                    name={`shirtSize`}
                    placeholder="T Shirt Sizes"
                    options={sizes}
                    onChange={(e) => this.setState({ [`shirtSize`]: e.value })}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        marginBottom: 10,
                        border: state.isFocused
                          ? "1px solid #ffd100"
                          : "1px solid rgba(0, 0, 0, .1)",
                        boxShadow: state.isFocused
                          ? "0 3px 10px -5px rgba(0, 0, 0, .3)"
                          : "",
                        ":hover": {
                          border: "1px solid #ff5800",
                          boxShadow: "0 3px 10px -5px rgba(0, 0, 0, .3)",
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#ff5800" : "",
                        ":hover": {
                          backgroundColor: "#ffd100",
                          color: "black",
                        },
                      }),
                    }}
                    css={{
                      fontSize: "16px",
                      width: 300,
                    }}
                  />
                </td>
                <td>
                  <Select
                    isSearchable={false}
                    name="college"
                    placeholder="College"
                    options={this.state.colleges}
                    onChange={(e) => this.setState({ collegeId: e.value })}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        marginBottom: 10,
                        border: state.isFocused
                          ? "1px solid #ffd100"
                          : "1px solid rgba(0, 0, 0, .1)",
                        boxShadow: state.isFocused
                          ? "0 3px 10px -5px rgba(0, 0, 0, .3)"
                          : "",
                        ":hover": {
                          border: "1px solid #ff5800",
                          boxShadow: "0 3px 10px -5px rgba(0, 0, 0, .3)",
                        },
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? "#ff5800" : "",
                        ":hover": {
                          backgroundColor: "#ffd100",
                          color: "black",
                        },
                      }),
                    }}
                    css={{
                      fontSize: "16px",
                      width: 300,
                    }}
                  />
                </td>
                <td>
                  <Button onClick={this.addVolunteer}>
                    {this.state.buttonText}
                  </Button>
                </td>
              </tr>
              {this.state.colleges.length > 0 &&
                this.state.volunteers.map((volunteer, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{volunteer.name}</td>
                    <td>{volunteer.registerNumber}</td>
                    <td>{volunteer.phoneNumber}</td>
                    <td>{volunteer.shirtSize}</td>
                    <td>
                      {
                        this.state.colleges.find(
                          (college) => college.value === volunteer.collegeId
                        ).label
                      }
                    </td>
                    <td>
                      <Link to={"/volunteers/core/" + volunteer._id}>
                        <button className="mucapp">Edit</button>
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default CoreVolunteer;
