interface Params {
    id: string
}

const ProductDetailsPage = ({params: {id}}: {params: Params}) => {
    return ( 
        <div>
            <h1>Product ID: {id}</h1>
        </div>
     );
}
 
export default ProductDetailsPage;