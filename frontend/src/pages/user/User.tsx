import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./user.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const User = () => {
  const { id } = useParams();

  const { isLoading, data } = useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      fetch(`http://localhost:8800/api/users/${id}`).then((res) => res.json()),
  });

  if (isLoading) return "Loading...";

  // Grafik için örnek veri
  const chartData = [
    { name: "Sun", visits: 4000, clicks: 2400 },
    { name: "Mon", visits: 3000, clicks: 1398 },
    { name: "Tue", visits: 2000, clicks: 3800 },
    { name: "Wed", visits: 2780, clicks: 3908 },
    { name: "Thu", visits: 1890, clicks: 4800 },
    { name: "Fri", visits: 2390, clicks: 3800 },
    { name: "Sat", visits: 3490, clicks: 4300 },
  ];

  return (
    <div className='user'>
      <div className='view'>
        <div className='info'>
          <div className='topInfo'>
            {data.img && <img src={data.img} alt='' />}
            <h1>{`${data.firstName} ${data.lastName}`}</h1>
            <button>Update</button>
          </div>
          <div className='details'>
            <div className='item'>
              <span className='itemTitle'>Email</span>
              <span className='itemValue'>{data.email}</span>
            </div>
            <div className='item'>
              <span className='itemTitle'>Phone</span>
              <span className='itemValue'>{data.phone}</span>
            </div>
            <div className='item'>
              <span className='itemTitle'>Status</span>
              <span className='itemValue'>
                {data.verified ? "Verified" : "Not Verified"}
              </span>
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
              <Line type='monotone' dataKey='clicks' stroke='#8884d8' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='activities'>
        <h2>Latest Activities</h2>
        <ul>
          <li>
            <div>
              <p>Kullanıcı profili güncellendi</p>
              <time>3 gün önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>Yeni bir sipariş verildi</p>
              <time>1 hafta önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>Hesap ayarları değiştirildi</p>
              <time>2 hafta önce</time>
            </div>
          </li>
          <li>
            <div>
              <p>Ürün incelemesi yapıldı</p>
              <time>1 ay önce</time>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default User;
