import React, { useState } from 'react';

export const Tabs = ({ children, onChange }) => {

  const [activeTab, setActiveTab] = useState(children.findIndex(child => child.props.active));
  if (activeTab == -1)
    setActiveTab(0);

  const mutableChildren = children.map(child => child);

  const onClick = (index) => {
    setActiveTab(index);
    if (onChange)
      onChange(index);
  }

  mutableChildren.forEach((child, index) => {
    let props = Object.assign({}, child.props, { active: activeTab == index, onClick, index })
    mutableChildren[index] = Object.assign({}, child, { props })
  });



  return <div className="tabs">
    {mutableChildren}
  </div>
}//s
export const Tab = ({ children, active, onClick, index }) => {
  return <a onClick={() => onClick(index)} className={"tab tab-bordered" + (active ? " tab-active" : "")}>{children}</a>
}
