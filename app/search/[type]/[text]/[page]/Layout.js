"use client"
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from 'next/navigation'; // Adjust import if needed for your Next.js version
import { Formik, Form, Field } from 'formik';
import Apicore from '../../../../ApiCore';
import MovieBlock from '../../../../Pages/MovieBlock';
import Pagination from '@/app/[type]/[genre]/[country]/[date]/[sort]/[page]/Component/Pagination';
import Button from '@/app/Component/Button';
const Layout = ({type, texts, page}) => {
  const text = decodeURIComponent(texts)
  const api = new Apicore()
  const router = useRouter();
  const [list, setList] = useState([])
  const [load, setloading] = useState(false)
  const [pagesNo, setPageNo] = useState(0)
  const handle  = async (values)=>{
    const { query, types} = values;
    if (!query.trim())
      {
        return
      }
    const encoded = encodeURIComponent(query)
   
    router.push(`/search/${types}/${encoded}/1`)
  }
  const handleSearch = async () => {
    try {
      if (!text?.trim())
      {
        return
      }
      setloading(true)
      let response

      if(type != "telenovela")
      {
      response = await api.get(
        `/3/search/${type}?query=${text}&include_adult=false&language=en-US&page=${page}`
      );
      setList(response.results || [])
      setPageNo(response?.total_pages || 0)
      }
      else{
        const res = await fetch(`/api/searchtelenovela?title=${text}&page=${page}`);
        const data = await res.json();
         if (res.ok) {
          setList(data.series || []);
          setPageNo(data?.pagination?.totalPages || 0)
}

      }
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error("Error fetching data:", error);
    }
  };

  const Right = () =>{
    router.push(`/search/${type}/${text}/${parseInt(page,10) + 1}`)
  }

  const Left = () =>{
    router.push(`/search/${type}/${text}/${parseInt(page,10) - 1}`)
  }


  useEffect(()=>{
    handleSearch()
  },[])
  return (
    <div className="relative min-h-[100vh] flex justify-center">
      <div
        className="top-6 sm:top-10 left-5 sm:left-10 text-3xl  sm:text-4xl cursor-pointer absolute"
        onClick={() => router.back()}
      >
        <IoArrowBack />
      </div>
      <div className=" pt-14 sm:pt-24 w-[95%] md:w-[80%]  xl:w-2/3 flex flex-col items-center">
        <div className="mb-3 cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out"  onClick={() => router.push('/')}>
          <img src="/logologo.png" className=" w-14 sm:w-20" alt="Logo" />
        </div>
        <div className=' mb-4  font-semibold text-xl text-opacity-80 text-white'><p>Search for movies and series</p></div>
        <Formik
          initialValues={{
            query: "",
            types: type, // Default to 'movie'
          }}
          onSubmit={handle}
        >
          {({ values, setFieldValue }) => (
            <Form className="w-[90%] sm:w-[70%] flex flex-col items-center">
              <div className=' flex w-full'>
              <div className="mb-4 w-full flex flex-col items-center">
                <Field
                  name="query"
                  className="w-full h-12 border-white border-[2px] border-opacity-40 bg-transparent rounded-xl px-3"
                  type="text"
                  placeholder="Search for movies or series"
                />
              </div>
              </div>
              <div className="flex gap-4 font-semibold text-lg mb-4">
                <label>
                  <Field
                    type="radio"
                    name="types"
                    value="movie"
                    className="mr-2"
                  />
                  Movie
                </label>
                <label>
                  <Field type="radio" name="types" value="tv" className="mr-2" />
                  TV Show
                </label>
              </div>
  
              <button
                type="submit"
                className=" mb-10"
              >
                <Button title={"Search"}/>
              </button>
            </Form>
          )}
        </Formik>
        <div className='min-h-[100vh]'>
       {load?<div>
        <img src='/logologo.png' className=' w-10 animate-bounce mt-10'/>
       </div> :
        <div className='  w-[100%] sm:mt-10 '>
          <div className=' flex flex-wrap justify-center'>
            {list.map((data, i)=>{
              return(
                <div key={i} className=' mx-2 mb-5'>
                  <MovieBlock data={data} passType={type}/>
                </div>
              )
            })}
          </div>
        </div>}
        </div>
        <div className=' w-full my-5'>
          <Pagination page={page} noOfPages={pagesNo} Right={Right} Left={Left}/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
