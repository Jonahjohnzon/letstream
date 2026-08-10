import React from 'react'
import ContentRow from './ContentRow'

const RecentWatch = ({ BackgroundList, Title, type }) => (
  <ContentRow BackgroundList={BackgroundList} Title={Title} type={type} mode="continue" />
)

export default RecentWatch