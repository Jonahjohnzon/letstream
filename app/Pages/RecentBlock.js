import React from 'react'
import PosterCard from '../Component/PosterCard'

const RecentBlock = ({ data, passType = "" }) => (
  <PosterCard data={data} passType={passType} mode="continue" />
)

export default RecentBlock