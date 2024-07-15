import { useRef } from 'react';

const useUserConnectedAlert = () => {
  const container = useRef(document.createElement('div'));
  const userConnectedAlert = (user: string) => {
    const card = document.createElement('div');

    container.current.className = 'absolute top-0 right-[100px]';
    card.textContent = 'User ' + user + ' connected';
    card.style.position = 'relative';
    card.className = 'shadow rounded p-[5px] bg-black text-white mt-[100px]';
    card.style.top = '0px';
    card.style.marginTop = '100px';
    card.style.marginTop = '10px';

    container.current.appendChild(card);
    document.body.appendChild(container.current);
    setTimeout(() => {
      container.current.removeChild(card);
    }, 1000);
  };

  return { userConnectedAlert };
};

export default useUserConnectedAlert;
