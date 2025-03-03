import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./product.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Product = () => {
  const { id } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`http://localhost:8800/api/products/${id}`).then((res) =>
        res.json()
      ),
  });

  if (isLoading) return "Loading...";

  // Grafik için örnek veri
  const chartData = [
    { name: "Sun", visits: 4000, orders: 2400 },
    { name: "Mon", visits: 3000, orders: 1398 },
    { name: "Tue", visits: 2000, orders: 3800 },
    { name: "Wed", visits: 2780, orders: 3908 },
    { name: "Thu", visits: 1890, orders: 4800 },
    { name: "Fri", visits: 2390, orders: 3800 },
    { name: "Sat", visits: 3490, orders: 4300 },
  ];

  return (
    <div className='product'>
      <div className='view'>
        <div className='info'>
          <div className='topInfo'>
            {data.img && <img src={data.img} alt='' />}
            <h1>{data.title}</h1>
            <button>Update</button>
          </div>
          <div className='details'>
            <div className='item'>
              <span className='itemTitle'>Price</span>
              <span className='itemValue'>{data.price}</span>
            </div>
            <div className='item'>
              <span className='itemTitle'>Producer</span>
              <span className='itemValue'>{data.producer}</span>
            </div>
            <div className='item'>
              <span className='itemTitle'>Color</span>
              <span className='itemValue'>{data.color}</span>
            </div>
            <div className='item'>
              <span className='itemTitle'>In Stock</span>
              <span className='itemValue'>{data.inStock ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
        <hr />
        <div className='chart'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='visits' stroke='#82ca9d' />
              <Line type='monotone' dataKey='orders' stroke='#8884d8' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='activities'>
        <h2>Latest Activities</h2>
        <ul>
          <li>
            <div>
              <p>{data.title} satın alındı</p>
              <time>3 gün önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>{data.title} istek listesine eklendi</p>
              <time>1 hafta önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>{data.title} için yorum yapıldı</p>
              <time>2 hafta önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>{data.title} stok durumu güncellendi</p>
              <time>1 ay önce</time>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Product;
