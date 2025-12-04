import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-brand-lightest/95 backdrop-blur-xl border-b border-brand-light/30 px-6 py-4 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-brand-primary lg:hidden hover:text-brand-dark transition-colors"
        >
          <FaBars />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-dark to-brand-primary">
            Dashboard
          </h2>
          <p className="text-xs font-bold text-brand-primary/70 hidden sm:block tracking-wide">
            Overview of your business
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-brand-primary/60 hover:text-brand-dark transition-colors group">
          <FaBell className="text-xl group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-brand-primary border-2 border-brand-lightest rounded-full animate-pulse"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-brand-light/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-brand-dark">Admin User</p>
            <p className="text-xs text-brand-primary font-bold">Super Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-dark p-[2px] cursor-pointer hover:shadow-lg hover:shadow-brand-primary/30 transition-all">
            <div className="h-full w-full rounded-full bg-brand-lightest flex items-center justify-center">
              <FaUserCircle className="text-3xl text-brand-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
