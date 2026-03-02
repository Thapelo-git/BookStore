import React,{useState,useEffect} from 'react'
import { Layout } from '../components/layout/Layout'


//import { BookGrid } from '../components/home/CategorySection'
import { BestsellerSection } from '../components/home/BestsellerSection'

import { Book } from '../types/book';

function Index() {
 const [books, setBooks] = useState<Book[]>([]);
   const [loading, setLoading] = useState(true);

   
     useEffect(() => {
       fetch("http://localhost:5002/api/books") 
         .then((res) => res.json())
         .then((data) => {
           const allBooks: Book[] = data.data || [];
          
           setBooks(allBooks);
           setLoading(false);
         })
         .catch((err) => {
           console.error(err);
           setLoading(false);
         });
     }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  return (
    
      
   <Layout> 
    
      {/* <BookGrid  /> */}
    <BestsellerSection books={books}/>
    
    
  
   </Layout>
  )
}

export default Index
