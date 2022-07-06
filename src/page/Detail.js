import React from 'react';
import {useParams} from 'react-router-dom';
import {useQuery} from 'react-query';
import {apis} from '../store/api';

const Detail = () => {


  const detailData = useQuery('detail_data', () => apis.getUserDetail('62c2cdbf9621babbc4512f94'), {
    onSuccess: (data) =>{
      console.log(data)
    },
    onError: (data) => {
      console.error(data);
    },
    staleTime: 10000,
  })

  if(detailData.isLoading) return null;
  console.log(detailData)
  return (
    <>
      <div></div>
    </>
  )
}

export default Detail;