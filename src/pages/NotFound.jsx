import { observer } from "mobx-react-lite";

const NotFound = observer(() => {
  return (
    <div className="all-center">
      <h1>404</h1>
      <p>К сожалению, запрашиваемая страница не найдена.</p>
      <p>Проверьте, правильно ли введен URL адрес.</p>
    </div>
  );
});

export default NotFound;
