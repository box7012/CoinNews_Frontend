<template>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
        <nav>
          <ul>
            <li><a href="/contact">Contact Me</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
  }
  </script>
  
  <style scoped>
  .footer {
    background-color: #444444;
    color: white;
    padding: 20px;
    text-align: center;
    position: relative; /* 고정되지 않도록 설정 */
    width: 100%;
  }
  
  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  footer p {
    margin: 0;
  }
  
  footer nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 15px;
  }
  
  footer nav ul li {
    display: inline;
  }
  
  footer nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 14px;
  }
  
  footer nav ul li a:hover {
    text-decoration: underline;
  }
  </style>
  