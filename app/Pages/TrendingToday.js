import React from 'react'
import ContentRow from './ContentRow'

const TrendingToday = ({ BackgroundList, Title, type }) => (
  <ContentRow BackgroundList={BackgroundList} Title={Title} type={type} mode="details" />
)

export default TrendingToday