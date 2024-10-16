//mainfolder/components/Container.js

const Container = ({ children }) => {
  return (
    <div className='max-w-[1250px] mx-auto bg-white min-h-screen flex flex-col border-l border-r'>
      {React.Children.map(children, (child) => {
        // Check if child is focusable and if aria-hidden is required
        if (React.isValidElement(child) && child.props['aria-hidden']) {
          // If aria-hidden is true, ensure no focusable elements exist inside
          const hasFocusable = [
            'a', 'button', 'input', 'textarea', 'select',
          ].includes(child.type) || (child.props.tabIndex && child.props.tabIndex >= 0);

          if (hasFocusable) {
            console.warn('Focusable element found inside an aria-hidden element:', child);
            // Optionally, you can filter out these children or handle them accordingly
            return null; // or return a placeholder if needed
          }
        }
        return child; // Return child if no issues
      })}
    </div>
  );
};

export default Container;

