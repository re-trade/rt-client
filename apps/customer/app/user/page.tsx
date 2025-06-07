const ProfilePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col items-center">
        <img src="/avatar.png" alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
        <p className="text-lg font-medium mb-2">John Doe</p>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>
    </div>
  );
};
export default ProfilePage;
