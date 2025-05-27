import Image from "next/image";
const HomePage = () => {
    return (<>
    <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="container mx-auto py-4 px-4 flex flex-col md:flex-row items-center">
                {/* Left Side: Image */}
                <div className="md:w-1/2">
                    <Image
                        src="https://statictuoitre.mediacdn.vn/thumb_w/640/2017/7-1512755474943.jpg"
                        alt="Kitchen Items"
                        width={600}
                        height={400}
                        className="rounded-lg"
                    />
                </div>

                {/* Right Side: Text and CTA */}
                <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6 bg-pink-100 p-6 rounded-lg">
                    <p className="text-sm text-gray-600">Vận hành 10 năm trong ngành dịch vụ</p>
                    <h1 className="text-3xl font-bold text-blue-600 mt-2">
                        Chào mừng đến với Retrade Shop
                    </h1>
                    <p className="mt-4 text-gray-700">
                        Với hơn 10 năm kinh nghiệm trong việc thiết kế Retrade Shop đã cung cấp
                        các sản phẩm dịch vụ tốt tại Việt Nam. Hãy khám phá
                        ngay hôm nay để tìm hiểu thêm về các sản phẩm đa dạng và chất lượng
                        của chúng tôi.
                    </p>
                    <button className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-300">
                        TƯ VẤN NGAY
                    </button>
                </div>
            </section>

            {/* Product Showcase Section */}
            <section className="container py-3 mx-auto px-4">
                <h2 className="text-2xl font-semibold text-blue-600 mb-6">
                    Nhứng sản phẩm nổi bật tại Retrade Shop
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Product Card 1 */}
                    <div className="bg-[#FFD2B2] text-white p-4 rounded-lg mx-auto w-fit">
                        <Image
                            src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg" 
                            alt="Chảo chổng đơn simple"
                            width={300}
                            height={200}
                            className="rounded-lg mb-4 "
                        />
                        <h3 className="text-black font-semibold text-center">Chảo chổng đơn simple</h3>
                        <p className="text-center text-black ">Chảo chổng đơn simple được đúc</p>
                    </div>

                    {/* Product Card 2 */}
                    <div className="bg-[#FFD2B2] text-white p-4 rounded-lg mx-auto w-fit">
                        <Image
                            src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg" 
                            alt="Bộ dụng cụ nhà bếp 7P"
                            width={300}
                            height={200}
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-black font-semibold text-center">Bộ dụng cụ nhà bếp 7P</h3>
                        <p className="text-center text-black">Sản phẩm được làm từ chất liệu cao cấp</p>
                    </div>

                    {/* Product Card 3 */}
                    <div className="bg-[#FFD2B2] text-white p-4 rounded-lg mx-auto w-fit">
                        <Image
                            src="https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg" 
                            alt="Chảo chổng đơn simple"
                            width={300}
                            height={200}
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-black font-semibold text-center">Chảo chổng đơn simple</h3>
                        <p className="text-center text-black">Chất liệu nhôm đúc nguyên khối</p>
                    </div>
                </div>
            </section>
        </div>
    </>);
}

export default HomePage;


