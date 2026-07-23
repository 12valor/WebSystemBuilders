const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');

if (menuButton && mobileMenu) {
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
  };

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
  });
}