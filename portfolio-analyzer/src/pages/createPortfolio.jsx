import { useNavigate } from 'react-router-dom';
import './createPortfolio.css';

function CreatePortfolio(){
    const navigate=useNavigate();

    return(
        <>
            <h1>Create your portfolio</h1>
            <form id="create" action="" method="post" acceptCharset="utf-8">
              <div class="parameter">
                <label for="">Start date</label>
                <input type="text" name="" id="" value="" />
              </div>
              <div class="parameter">
              <label for="">End date</label>
              <input type="text" name="" id="" value="" />
              </div>
              <div class="parameter">
              <label for="">Market benchmark</label>
              <input type="text" name="" id="" value="" />
              </div>
              <div class="stocks">
                <div class="stock">
                  <label for="">Stock_1</label>
                  <input type="text" name="" id="" value="" />
                </div>
                <button class="add">{'\u002B'}</button>
              </div>
                  <button class="build" onClick={() => navigate('/dashboard')}>Build</button>
            </form>
        
        </>
    );
}
export default CreatePortfolio