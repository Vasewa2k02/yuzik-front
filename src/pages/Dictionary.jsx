import { useContext, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

import { observer } from "mobx-react-lite";
import { updateWord } from "../api-requests/word-api";
import "../styles/common.css";
import "../styles/dictionary-page.css";
import Input from "../components/Input";
import { REGEXES } from "../utils/regexes";

import * as dictionaryApi from "../api-requests/dictionary-api";
import * as wordApi from "../api-requests/word-api";
import { validateDto } from "../utils/helpers";
import { Toast } from "primereact/toast";
import { Context } from "..";
import { ROLES } from "../utils/roles";
import { NOT_FOUND } from "../utils/statuses";
import { INVALID_INPUT, OLD_DATA } from "../utils/error-messages";

const Dictionary = observer(() => {
  const { user } = useContext(Context);
  const toast = useRef(null);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Успешно",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Ошибка",
      detail:
        message || "Вы ввели неверные данные или данные на странице устарели",
      life: 3000,
    });
  };

  const [dictionaries, setDictionaries] = useState(null);
  const [dictionaryFilters, setDictionaryFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [dictionaryFilterValue, setDictionaryFilterValue] = useState("");
  const [selectedDictionary, setSelectedDictionary] = useState(null);

  const [words, setWords] = useState(null);
  const [wordFilters, setWordFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [wordFilterValue, setWordFilterValue] = useState("");

  useEffect(() => {
    loadData();
    initFilters();
  }, []);

  const loadData = async () => {
    try {
      const _dictionaries =
        user.getRoleId() === ROLES.USER
          ? await dictionaryApi.getUserDictionaries()
          : await dictionaryApi.getAdminDictionaries();
      setDictionaries(_dictionaries);
      setSelectedDictionary(_dictionaries[0]);
      setWords(_dictionaries[0].words);
    } catch (error) {}
  };

  const initFilters = () => {
    setDictionaryFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setDictionaryFilterValue("");
    setWordFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setDictionaryFilterValue("");
  };

  const renderHeader = (filterValue, filterChange, tableName) => {
    return (
      <div className="table-header">
        <span className="text-xl text-900 font-bold">{tableName}</span>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filterValue}
            onChange={filterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const [dictionaryDto, setDictionaryDto] = useState({
    name: "",
    description: null,
  });

  const [isDictionaryValid, setIsDictionaryValid] = useState({
    name: true,
    description: true,
  });

  const dictionaryRegexes = {
    name: REGEXES.DICTIONARY_NAME_REGEX,
    description: REGEXES.DICTIONARY_DESCRIPTION_REGEX,
  };

  const selectDictionary = (e) => {
    setSelectedDictionary(e.value);
    setWords(dictionaries.find((item) => item.id === e.value.id).words);
  };

  const changeDictionaryHandler = ({ id, value }) => {
    setDictionaryDto((prev) => ({ ...prev, [id]: value }));
  };

  const createDictionary = async (e) => {
    e.preventDefault();

    if (!validateDto(dictionaryDto, dictionaryRegexes, setIsDictionaryValid)) {
      return;
    }

    try {
      const cteatedDictionary = await dictionaryApi.createDictionary({
        name: dictionaryDto.name,
        description: dictionaryDto.description,
      });

      dictionaries.push(cteatedDictionary);
      setDictionaries(dictionaries);

      setDictionaryDto({
        name: "",
        description: "",
      });
    } catch (error) {
      if (error?.response?.status === NOT_FOUND) {
        await loadData();
        showError(OLD_DATA);
      } else {
        showError(INVALID_INPUT);
      }
    }
  };

  const onDictionaryEditComplete = async (e) => {
    const _dictionaries = [...dictionaries];
    const { newData, index } = e;
    const { id, words, creatorId, ..._dictionaryDto } = newData;

    for (const prop in _dictionaryDto) {
      if (!dictionaryRegexes[prop].test(_dictionaryDto[prop])) {
        showError("Вы ввели неверные данные");
        return;
      }
    }

    try {
      await dictionaryApi.updateDictionary(newData.id, newData);
      _dictionaries[index] = newData;
      setDictionaries(_dictionaries);
    } catch (error) {
      if (error?.response?.status === NOT_FOUND) {
        await loadData();
        showError(OLD_DATA);
      } else {
        showError(INVALID_INPUT);
      }
    }
  };

  const actionDictionaryBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        onClick={() => deleteDictionaryRow(rowData.id)}
      />
    );
  };

  const deleteDictionaryRow = async (id) => {
    try {
      await dictionaryApi.deleteDictionary(id);
      setDictionaries(dictionaries.filter((item) => item.id !== id));
      setSelectedDictionary(null);
      setWords(null);
    } catch (error) {
      if (error?.response?.status === NOT_FOUND) {
        await loadData();
        showError(OLD_DATA);
      } else {
        showError(INVALID_INPUT);
      }
    }
  };

  const dictionaryFilterChange = (e) => {
    const value = e.target.value;
    const _dictionaryFilters = { ...dictionaryFilters };

    _dictionaryFilters["global"].value = value;

    setDictionaryFilters(_dictionaryFilters);
    setDictionaryFilterValue(value);
  };

  const dictionaryHeader = renderHeader(
    dictionaryFilterValue,
    dictionaryFilterChange,
    "Словари"
  );

  const [wordDto, setWordDto] = useState({
    englishSpelling: "",
    transcription: "",
    russianSpelling: "",
    description: "",
  });

  const [isWordValid, setIsWordValid] = useState({
    englishSpelling: true,
    transcription: true,
    russianSpelling: true,
    description: true,
  });

  const wordRegexes = {
    englishSpelling: REGEXES.WORD_ENGLISH_REGEX,
    transcription: REGEXES.WORD_TRANSCRIPTION_REGEX,
    russianSpelling: REGEXES.WORD_RUSSIAN_REGEX,
    description: REGEXES.WORD_DESCRIPTION_REGEX,
  };

  const changeWordHandler = ({ id, value }) => {
    setWordDto((prev) => ({ ...prev, [id]: value }));
  };

  const createWord = async (e) => {
    e.preventDefault();

    if (selectedDictionary === null) {
      showError(
        "Вы не выбрали словарь в который хотите добавить слово! Это можно сделать кликнув на нужный словарь."
      );
      return;
    }

    if (!validateDto(wordDto, wordRegexes, setIsWordValid)) {
      return;
    }

    try {
      const createdWord = await wordApi.createWord(selectedDictionary.id, {
        englishSpelling: wordDto.englishSpelling,
        transcription: wordDto.transcription,
        russianSpelling: wordDto.russianSpelling,
        description: wordDto.description,
      });

      const _dictionaries = [...dictionaries];
      const _index = _dictionaries.indexOf(selectedDictionary);

      _dictionaries[_index].words.push(createdWord);

      setDictionaries(_dictionaries);
      setWords(_dictionaries[_index].words);

      setWordDto({
        englishSpelling: "",
        transcription: "",
        russianSpelling: "",
        description: "",
      });
    } catch (error) {
      if (error?.response?.status === NOT_FOUND) {
        await loadData();
        showError(OLD_DATA);
      } else {
        showError(INVALID_INPUT);
      }
    }
  };

  const onWordEditComplete = async (e) => {
    try {
      const { newData, index } = e;
      const { id, ..._wordDto } = newData;

      for (const prop in _wordDto) {
        if (!wordRegexes[prop].test(_wordDto[prop])) {
          showError("Вы ввели неверные данные");
          return;
        }
      }

      await updateWord(id, newData);

      const _dictionaries = [...dictionaries];
      const _dictionaryIndex = dictionaries.indexOf(selectedDictionary);

      _dictionaries[_dictionaryIndex].words[index] = newData;

      setDictionaries(_dictionaries);
      setWords(_dictionaries[_dictionaryIndex].words);
    } catch (error) {
      if (error?.response?.status === NOT_FOUND) {
        await loadData();
        showError(OLD_DATA);
      } else {
        showError(INVALID_INPUT);
      }
    }
  };

  const actionWordBodyTemplate = (rowData) => {
    return (
      <Button icon="pi pi-trash" onClick={() => deleteWordRow(rowData.id)} />
    );
  };

  const deleteWordRow = async (id) => {
    try {
      await wordApi.deleteWord(id, selectedDictionary.id);
      const _dictionaries = [...dictionaries];
      const _dictionaryIndex = _dictionaries.indexOf(selectedDictionary);
      const _wordIndex = words.findIndex((item) => item.id === id);

      _dictionaries[_dictionaryIndex].words.splice(_wordIndex, 1);

      setDictionaries(_dictionaries);
      setWords(_dictionaries[_dictionaryIndex].words);
    } catch (error) {
      showError();
      await loadData();
    }
  };

  const wordFilterChange = (e) => {
    const value = e.target.value;
    const _wordFilters = { ...wordFilters };

    _wordFilters["global"].value = value;

    setWordFilters(_wordFilters);
    setWordFilterValue(value);
  };

  const wordHeader = renderHeader(wordFilterValue, wordFilterChange, "Слова");

  const [fileContent, setFileContent] = useState(null);
  const [currentImportDictionaryId, setCurrentImportDictionaryId] = useState();

  const actionDictionaryImport = (rowData) => {
    return (
      <Button
        icon="pi pi-file-export"
        onClick={() => openFilePicker(rowData)}
      />
    );
  };

  const openFilePicker = (rowData) => {
    setCurrentImportDictionaryId(rowData.id);
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const content = e.target.result;
          setFileContent(content);

          await wordApi.createWordArray(
            currentImportDictionaryId,
            JSON.parse(content)
          );

          loadData();
        };

        reader.readAsText(file);
      }
    } catch (error) {
      showError("Структура файла не соответствует требованиям");
    }
  };

  return (
    <div className="dictionary-container">
      <Toast ref={toast} />
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="tables">
        <DataTable
          className="card"
          value={dictionaries}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onDictionaryEditComplete}
          filters={dictionaryFilters}
          header={dictionaryHeader}
          globalFilterFields={["name"]}
          sortOrder={1}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          selectionMode="single"
          selection={selectedDictionary}
          onSelectionChange={selectDictionary}
          metaKeySelection={true}
        >
          <Column
            field="name"
            header="назване"
            editor={(options) => textEditor(options)}
            sortable
            filterField="name"
          />
          <Column
            field="description"
            header="описание"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            rowEditor
            headerStyle={{ width: "10px" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column body={actionDictionaryBodyTemplate} />
          <Column header="импорт" body={actionDictionaryImport} />
        </DataTable>
        <DataTable
          className="card"
          value={words}
          editMode="row"
          dataKey="id"
          onRowEditComplete={onWordEditComplete}
          filters={wordFilters}
          header={wordHeader}
          globalFilterFields={["englishSpelling", "russianSpelling"]}
          sortOrder={1}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
        >
          <Column
            field="englishSpelling"
            header="английский"
            editor={(options) => textEditor(options)}
            sortable
            filterField="englishSpelling"
          />
          <Column
            field="transcription"
            header="транскрипция"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            field="russianSpelling"
            header="русский"
            editor={(options) => textEditor(options)}
            sortable
            filterField="russianSpelling"
          />
          <Column
            field="description"
            header="описание"
            editor={(options) => textEditor(options)}
            sortable
          />
          <Column
            rowEditor
            headerStyle={{ width: "10px" }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column body={actionWordBodyTemplate} />
        </DataTable>
      </div>
      <div className="input-area margin-top-30">
        <div className="dictionary-fields">
          <h4 className="dictionary-fields__name">
            Форма для добавления словарей
          </h4>
          <Input
            id="name"
            value={dictionaryDto.name}
            lableText="Название"
            isValidValue={isDictionaryValid.name}
            inputType="text"
            setDataHandler={changeDictionaryHandler}
            errorMessage="Некорректное название словаря"
          />
          <Input
            id="description"
            value={dictionaryDto.description}
            lableText="Описание"
            isValidValue={isDictionaryValid.description}
            inputType="text"
            placeholder="необязательное поле"
            setDataHandler={changeDictionaryHandler}
            errorMessage="Некорректное описание"
          />
          <Button
            className="dictionary-fields__button"
            label="Добавить"
            onClick={createDictionary}
          />
        </div>
        <div className="word-fields">
          <h4 className="word-fields__name">Форма для добавления слов</h4>
          <Input
            id="englishSpelling"
            value={wordDto.englishSpelling}
            lableText="английский"
            isValidValue={isWordValid.englishSpelling}
            inputType="text"
            setDataHandler={changeWordHandler}
            errorMessage="От 2 до 30 английских символов"
          />
          <Input
            id="transcription"
            value={wordDto.transcription}
            lableText="транскрипция"
            isValidValue={isWordValid.transcription}
            inputType="text"
            setDataHandler={changeWordHandler}
            errorMessage="От 2 до 50 символов"
          />
          <Input
            id="russianSpelling"
            value={wordDto.russianSpelling}
            lableText="русский"
            isValidValue={isWordValid.russianSpelling}
            inputType="text"
            setDataHandler={changeWordHandler}
            errorMessage="От 2 до 30 руссих символов"
          />
          <Input
            id="description"
            value={wordDto.description}
            lableText="описание"
            isValidValue={isWordValid.description}
            inputType="text"
            placeholder="необязательное поле"
            setDataHandler={changeWordHandler}
            errorMessage="До 30 символов"
          />
          <Button
            className="word-fields__button"
            label="Добавить"
            onClick={createWord}
          />
        </div>
      </div>
    </div>
  );
});

export default Dictionary;
