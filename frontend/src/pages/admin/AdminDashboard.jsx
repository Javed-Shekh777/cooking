import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboard } from "../../features/adminSlice";
import { useEffect } from "react";
import toast from 'react-hot-toast'

const AdminDashboard = () => {

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.admin);
  // const {deleteRequests,recipes} = useSelector((state) => state.analytics);
  console.log(dashboard);

  const fetchDashboard = async () => {
    try {
      const res = await dispatch(getAdminDashboard()).unwrap();
      console.log("Response DD:", res);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  }
  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Total Users</span>
          <span className="text-3xl font-bold text-blue-600">{dashboard?.users?.total || 0}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Total Chefs</span>
          <span className="text-3xl font-bold text-red-600">{dashboard?.users?.chefs || 0}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Total Recipes</span>
          <span className="text-3xl font-bold text-green-600">{dashboard?.recipes?.total || 0}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Total Categories</span>
          <span className="text-3xl font-bold text-purple-600">{dashboard?.categories || 0}</span>
        </div>


        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Total Requests</span>
          <span className="text-3xl font-bold text-purple-600">{dashboard?.requests?.total || 0}</span>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Pending Requests</span>
          <span className="text-3xl font-bold text-purple-600">{dashboard?.requests?.pending || 0}</span>
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-xl font-semibold text-gray-700">Rejected Requests</span>
          <span className="text-3xl font-bold text-purple-600">{dashboard?.requests?.rejected || 0}</span>
        </div>

      </div>

      {/* Latest Recipes */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[]?.map((recipe) => (
          <div key={recipe._id} className="bg-white shadow rounded-lg overflow-hidden">
            <img
              src={recipe.image || "/default-recipe.jpg"}
              alt={recipe.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{recipe.title}</h3>
              <p className="text-sm text-gray-600">{recipe.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Categories</h2>
      <div className="flex flex-wrap gap-3 mb-8">
        {[].map((cat) => (
          <span
            key={cat}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Chefs */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chefs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[].map((chef) => (
          <div key={chef._id} className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
            <img
              src={chef.profileImage?.url || "/default-chef.jpg"}
              alt={chef.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-800">{chef.fullName}</h4>
              <p className="text-sm text-gray-600">
                {chef.chefProfile?.specialization?.join(", ") || "No specialization"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate dolorem ipsa exercitationem corporis, vero dolore alias. Odio, architecto. Ex ullam sequi placeat aperiam architecto veritatis corrupti assumenda alias enim. Rem laudantium ipsum porro harum recusandae nulla quae ea, expedita quaerat eum voluptas repudiandae, odit nihil et corporis maxime! Molestias, nemo asperiores earum beatae quis animi ducimus deserunt ex aut fuga atque ad labore ipsam dolorum repellat repellendus itaque quasi, in quae laboriosam! Eius minima eveniet a cupiditate, reiciendis sed temporibus eaque possimus. Consequuntur et laborum, eum distinctio cumque commodi sed est dignissimos odio officiis ipsum suscipit iste cupiditate, architecto eligendi doloremque magni exercitationem quod mollitia! Facere eos iste corrupti commodi modi neque aut hic est minus alias totam, quidem pariatur sint in, nostrum assumenda odio recusandae nam, nobis itaque dicta laboriosam beatae molestiae. Ipsam quidem soluta veritatis? Quibusdam at corrupti debitis error, aliquam sit neque quas porro soluta sint laborum beatae provident possimus, ut veritatis quod placeat voluptatum consequatur nostrum maiores delectus. Consequatur sed adipisci nisi officiis rem praesentium labore reprehenderit quia nemo cum molestias eum porro laboriosam culpa aperiam autem saepe, eveniet laudantium soluta sint. Beatae maiores vero dolore suscipit deserunt nihil nostrum neque labore nisi omnis animi, tenetur sapiente aut unde, commodi explicabo corrupti illo? Deserunt, temporibus aliquam? Accusamus vero eaque asperiores. Dolores unde facilis veritatis nam numquam similique distinctio maxime quisquam nemo facere voluptates dolore ipsa repellat ex, a velit cupiditate dolor quidem culpa omnis voluptatum! Porro molestiae corrupti doloribus ratione, assumenda voluptates commodi error iste accusantium maxime repellat consequuntur similique praesentium hic voluptate facere veritatis. Distinctio iste atque voluptas pariatur dicta maiores optio magni laudantium at fugiat? Non, commodi! Doloribus sint cumque ratione ea placeat error sit, vel dolorem ipsum quas similique libero sapiente ad delectus repellat quis dolor. Quos eaque repellendus reiciendis et itaque ipsa cumque dolorum quasi, dolores quisquam. Aliquid nam magnam quam deserunt beatae soluta sequi veritatis quasi recusandae! Sapiente quo at minima adipisci aliquam doloribus dolores fuga molestiae beatae doloremque dolore quos iusto autem sit repellendus, id mollitia enim molestias, recusandae dicta ex facere ad pariatur obcaecati? Fugiat nostrum sapiente corporis nobis nam voluptatem inventore ex numquam libero dolore illum, esse blanditiis! Commodi culpa voluptas modi necessitatibus dolor animi repellat delectus perferendis iusto minima quas repudiandae et maxime nemo, neque impedit laborum aut eligendi id aperiam, dicta totam tempore ea! Dignissimos quas fuga fugit eum non nobis libero, quibusdam velit, quisquam, unde assumenda quod eveniet cumque doloremque aut et voluptas odit possimus! Magnam voluptas blanditiis eveniet incidunt praesentium autem rerum corrupti natus doloremque earum fugiat voluptates deserunt quis, quidem sequi voluptatem? Ipsum animi quibusdam obcaecati cupiditate quis accusamus corrupti. Totam, neque facilis cumque dolore, sit nostrum amet corrupti, error natus beatae minima vel facere libero. Repudiandae consequatur ipsum saepe quo quia nulla, recusandae sequi similique nam doloribus, voluptatibus maxime. Soluta asperiores a sequi qui, suscipit voluptatem nulla ipsam quaerat porro esse, placeat non veritatis dolores dolore ullam accusantium repellendus? Sed sunt dolor voluptatem reiciendis nobis atque quis, perspiciatis voluptate cumque doloribus ducimus qui quidem repellat debitis at neque magni. Ab in voluptas voluptates quidem ducimus totam esse ipsa assumenda eaque, odit nisi dolore quia excepturi soluta perferendis debitis corporis asperiores nulla optio exercitationem, amet quibusdam voluptatibus! Temporibus praesentium aspernatur reiciendis repellendus odio aliquam fugit, sunt illo dolor. Ullam inventore libero, eligendi vitae repellat facilis illo corrupti nulla ea blanditiis maxime iste unde deleniti, quibusdam incidunt totam quasi culpa sequi consectetur? Et magni iure adipisci nesciunt enim praesentium aliquid consequatur mollitia suscipit nam error sequi dolor nostrum minima aperiam, tempora aut labore, accusantium at, molestiae incidunt ipsa! Qui vel minima doloremque ipsum consectetur ut, quod repellendus tempore incidunt iure sint a rem, sed quam est cupiditate molestiae ullam sit dolores, magni fugit at officiis dolore porro! Ipsa hic illum ea asperiores fuga sunt error alias, qui libero soluta officia accusantium nisi rem, laborum mollitia consequatur expedita distinctio pariatur natus! Distinctio corrupti accusantium esse officia voluptatibus dignissimos laborum, soluta fugit vel reprehenderit molestias id enim natus ipsa repellendus temporibus numquam porro nostrum mollitia iure delectus nisi nesciunt qui ullam. Enim corrupti vitae consequuntur fugiat, atque ut fuga. Maiores eveniet fugit alias, quae consequuntur quia nemo voluptatibus sequi neque veniam esse pariatur odio id sapiente nam nesciunt aspernatur amet mollitia illum iure ad nihil, fugiat cumque facere? Temporibus mollitia ullam eligendi sapiente et modi harum aliquam suscipit quisquam eum fugit repellat corrupti perspiciatis iste quo voluptates labore nisi enim tenetur facere cupiditate, voluptate dolor distinctio aspernatur? Deserunt labore minus perferendis. Amet ipsa, beatae molestiae voluptas voluptates qui vitae dignissimos quidem a cum eius porro voluptate in atque veniam praesentium dolore sit laudantium blanditiis? Optio ipsam quisquam itaque libero, a deserunt laboriosam explicabo pariatur fuga alias odit excepturi, iste dolorum accusamus, ex omnis expedita quae unde totam tenetur tempore consequatur sequi. Aut perferendis quaerat assumenda, ratione aspernatur amet saepe consectetur sint cumque iste architecto quod voluptatum vel accusantium quia modi dolorum nesciunt beatae. Tempore nam aspernatur ipsam suscipit nobis ea nemo, quod maxime obcaecati blanditiis incidunt consequatur neque quas vitae distinctio nostrum praesentium assumenda eius quaerat cumque maiores facere sint illo debitis? Minima quas autem ullam corporis ipsum quae? Non pariatur incidunt fuga, unde obcaecati dolorum sit nostrum possimus explicabo exercitationem commodi ullam, sequi eveniet nesciunt temporibus error, ex voluptatem at nobis culpa. Tempore quam, placeat officiis nulla, minima voluptate quas, aliquid praesentium suscipit adipisci iusto consequuntur voluptas ullam harum. Ab aut fugiat aliquid soluta consequuntur, doloribus maxime, eius non expedita iusto est! Dolor, consequuntur. Quis maiores voluptatum impedit neque! Molestiae fugiat nesciunt corporis exercitationem ab hic magni cupiditate perspiciatis? Adipisci facilis ab debitis itaque iusto distinctio id corporis, necessitatibus, ut repellendus cupiditate nulla nam in saepe cum beatae tempora animi soluta veritatis atque inventore obcaecati tenetur quos? Facere neque voluptate assumenda ipsam aliquid quaerat dolores aperiam, dolorum atque fuga et odit, vel minima, repellat quae eum veritatis? Placeat, officia, ex, et porro fuga amet ipsa quis quo id eaque est recusandae laborum nobis iste! Quisquam voluptas tempora atque ea ab? Temporibus laboriosam dolores nihil molestias.</p>
    </div>
  );
};

export default AdminDashboard;
