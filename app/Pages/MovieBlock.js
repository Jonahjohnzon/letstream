import React from 'react'
import PosterCard from '../Component/PosterCard'

const MovieBlock = ({ data, passType = "" }) => (
  <PosterCard data={data} passType={passType} mode="details" />
)

export default MovieBlock