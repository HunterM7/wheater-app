import { FC, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  SearchRounded as SearchRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon,
  FmdGoodOutlined as FmdGoodOutlinedIcon,
} from '@mui/icons-material'
import cn from 'classnames'

// Types 'n utils
import { debounce, getUrl } from 'utils'
import { useKeyPress } from 'hooks'

// Zustand
import { useSearch } from 'store'

// Components 'n UI
import { Button } from 'ui'

// Styles
import styles from './SearchBar.module.scss'

export const SearchBar: FC = () => {
  // Zustand
  const {
    searchStatus,
    searchQuery,
    changeSearchQuery,
    isOpen,
    toggle,
    closeSearch,
    data,
    getData,
  } = useSearch()

  const debouncedGetData = useMemo(() => debounce(getData, 1000), [getData])

  // Esc handler
  useKeyPress('Escape', closeSearch)

  // Handlers
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value
    const url = newQuery ? getUrl.geo(newQuery) : null

    changeSearchQuery(newQuery)

    if (url) {
      debouncedGetData(url)
    }
  }

  function handleSearchItemClick() {
    toggle()
  }

  return (
    <div className={cn(styles.search, isOpen && styles.active)}>
      <div className={cn(styles.wrapper)}>
        <input
          type="search"
          name="search"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search city..."
          autoComplete="off"
          className={cn(
            styles.input,
            searchStatus === 'pending' && styles.searching,
          )}
        />

        <SearchRoundedIcon
          className={styles.searchIcon}
          sx={{ fontSize: '2.4rem' }}
        />

        <Button
          // hasState
          aria-label="close search"
          StartIcon={ArrowBackRoundedIcon}
          className={styles.leadingIcon}
          onClick={toggle}
        />
      </div>

      <div className={cn(styles.result, styles.active)}>
        <ul className={styles.list} data-search-list>
          {data?.map((item, index) => (
            <li
              key={index}
              className={styles.list__item}
              onClick={handleSearchItemClick}
            >
              <FmdGoodOutlinedIcon
                className={styles.list__icon}
                sx={{ fontSize: '2.4rem' }}
              />

              <div>
                <p className={styles.list__title}>{item.name}</p>

                <p className={styles.list__subtitle}>
                  {`${item.state || ''} ${item.country}`}
                </p>
              </div>

              <Link
                to={`/weather?lat=${item.lat}&lon=${item.lon}`}
                aria-label={`${item.name} weather`}
                className={`${styles.list__link}`}
              ></Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SearchBar
