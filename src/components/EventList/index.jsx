import React from "react";
import { navigate } from 'gatsby';
import { List, Avatar, Tag, Form } from 'antd';
import constants from '../../utils/constants';

class EventList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentWillMount = () => {
    fetch(constants.server + "/events").then(res => res.json()).then(res => {
      this.setState({
        events: res.data,
      });
    });
  }

  render() {
    return (
      <List
        itemLayout="horizontal"
        dataSource={this.state.events}
        renderItem={item => (
          <List.Item onClick={event => {
            if(typeof window !== `undefined`) {
              navigate(`app/events/${item.id}/rounds`);
            }
          }}>

            <List.Item.Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title={item.name}
              description={item.description}
            />
            { 
              (item.status === 1) ? <Tag color="#2db7f5">Scheduled</Tag> : (item.status === 2) ? <Tag color="#87d068">In process</Tag> : <Tag color="#f50">Finished</Tag>
            }
            
            
          </List.Item>
        )}
      />
    );
  }
}

export default Form.create({ name: 'event_list' })(EventList);