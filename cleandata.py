import pandas as pd

path = "data/netflix.csv"

with open(path, 'rb') as f:
    df = pd.read_csv(f)

genre_count_series = pd.Series(df['listed_in'].str.split(', ')).explode().value_counts()
genre_count_df = genre_count_series.to_frame().reset_index()
genre_count_df.columns = ['Genre', 'Count']
genre_count_df.to_csv('data/netflix_genre_count.csv', index=False, header=True)

cast_links = {}
cast_df = pd.DataFrame(columns=['source', 'target'])
cast_num_movies = {}

cast_list = df[df['cast'].notnull()]['cast'].str.split(', ')
for movie_cast in cast_list:
    if len(movie_cast) > 1:
        for i in range(len(movie_cast)):
            if movie_cast[i] in cast_num_movies:
                cast_num_movies[movie_cast[i]] += cast_num_movies[movie_cast[i]] + 1
            else:
                cast_num_movies[movie_cast[i]] = 1
            to_add = movie_cast[:]
            to_add.remove(movie_cast[i])
            if movie_cast[i] in cast_links:
                cast_links[movie_cast[i]].update(to_add)
            else:
                cast_links[movie_cast[i]] = set(to_add)

sorted_cast = sorted(cast_links, key=lambda k: cast_num_movies[k], reverse=True)[:30]

for key in sorted_cast:
    for value in cast_links[key]:
        if value in sorted_cast:
            if key < value:
                cast_df = cast_df.append({'source': key, 'target': value}, ignore_index=True)
            else:
                cast_df = cast_df.append({'source': value, 'target': key}, ignore_index=True)


cast_df.drop_duplicates().to_csv('data/netflix_cast.csv', index=False, header=True)


