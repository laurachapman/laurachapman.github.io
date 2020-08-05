import csv

filename = 'chicken_data.csv'
first_line = True
chicken_dishes = []
dish_to_votes = {}
num_to_dish = {}
count = 0
# for condorcet system
dish_to_all_votes = {}

def int_from_string(s):
	for word in s.split():
		if word.isdigit():
			return int(word)

with open(filename, 'r') as file:
	for line in csv.reader(file):
		if first_line:
			for item in line:
				start = item.index('[')
				end = item.index(']')
				dish = item[start+1:end]
				chicken_dishes.append(dish)
				dish_to_votes[dish] = []
				dish_to_all_votes[dish] = []
				num_to_dish[count] = dish
				count += 1

			first_line = False
		else:
			# print("line:", line)
			for i in range(0, len(line)):
				dish = num_to_dish[i]
				num = int_from_string(line[i])
				if num:
					dish_to_votes[dish].append(num)
					dish_to_all_votes[dish].append(num)
				else:
					# append something ridiculously large so Condorcet will work
					dish_to_all_votes[dish].append(100000)


def print_results(d, label, original_votes):
	print(label)
	count = 1
	for item in d:
		print(f"\t{count}: {item[0]} (score {item[1]:.3f}) (total votes: {len(original_votes[item[0]])})")
		count += 1
	print()	

def sort_dict(d, r=True):
	return sorted(d.items(), key=lambda x: x[1], reverse=r)

def borda_winner(dict_of_votes):
	borda_dict = {}
	borda_dict_normalized = {}
	num_candidates = float(len(dict_of_votes))

	for key in dict_of_votes:
		borda_sum = 0
		for vote in dict_of_votes[key]:
			b = (num_candidates - vote)/num_candidates
			borda_sum += b
		borda_dict[key] = borda_sum
		# divide by the number of votes to normalize
		if len(dict_of_votes[key]) != 0:
			borda_dict_normalized[key] = borda_sum/len(dict_of_votes[key])
		else:
			borda_dict_normalized[key] = 0

	return (borda_dict, borda_dict_normalized)

def dowall_winner(dict_of_votes):
	dowall_dict = {}
	dowall_dict_normalized = {}

	for key in dict_of_votes:
		dowall_sum = 0
		for vote in dict_of_votes[key]:
			b = 1.0/vote
			dowall_sum += b
		dowall_dict[key] = dowall_sum
		# divide by the number of votes to normalize
		if len(dict_of_votes[key]) != 0:
			dowall_dict_normalized[key] = dowall_sum/len(dict_of_votes[key])
		else:
			dowall_dict_normalized[key] = 0

	return (dowall_dict, dowall_dict_normalized)


def return_pref_candidate(dict_of_all_votes, c1, c2):
	# number of people preferring each candidate
	pref_c1 = 0
	pref_c2 = 0
	for ii in range(len(dict_of_all_votes)):
		# if its a tie neither is incremented
		if dict_of_all_votes[c1][ii] > dict_of_all_votes[c2][ii]:
			pref_c2 += 1
		if dict_of_all_votes[c2][ii] > dict_of_all_votes[c1][ii]:
			pref_c1 += 1


	if pref_c1 > pref_c2:
		return c1
	if pref_c2 > pref_c1:
		return c2
	# in the case of a tie
	return None		


def condorcet_system(dict_of_all_votes):
	condorcet_matrix = [len(dict_of_all_votes) * [None]] * len(dict_of_all_votes)
	# print("condorcet_matrix:", condorcet_matrix)
	keys = dict_of_all_votes.keys()
	wins_dict = {}
	for key in keys:
		wins_dict[key] = 0.0

	for i, c1 in enumerate(keys):
		for j, c2 in enumerate(keys):
			if i < j:
				winner = return_pref_candidate(dict_of_all_votes, c1, c2)
				if winner:
					wins_dict[winner] += 1

	sorted_wins = sort_dict(wins_dict)
	# see if there are ties
	winning_amount = sorted_wins[0][1]
	winners = []
	for item in sorted_wins:
		if item[1] == winning_amount:
			winners.append(item[0])

	# see who wins out of the winners- do a runoff
	while len(winners) != 1:
		old_length = len(winners)
		new_winners = []
		for win1 in winners:
			for win2 in winners:
				w = return_pref_candidate(dict_of_all_votes, win1, win2)
				if w:
					new_winners.append(w)
		# if its a tie 
		if old_length == len(new_winners) or len(new_winners) == 0:
			break
		else:
			winners = new_winners

	return wins_dict, winners

def write_to_file(keys, votes_dict, bd, bdn, dw, dwn, cd):
	# headings
	headings = ['dish', 'votes_list', 'borna', 'borda_normalized', 'dowall', 'dowall_normalized', 'condorcet_count']

	with open('processed_data.csv', 'w') as f:
		for h in range(0, len(headings)):
			if h != (len(headings)-1):
				f.write("%s,"%(headings[h]))
			else:
				f.write("%s\n"%(headings[h]))
		for key in keys:
			f.write("%s,%s,%s,%s,%s,%s,%s\n"%(key,votes_dict[key],bd[key],bdn[key],dw[key],dwn[key],cd[key]))


def write_summary_to_file(keys, bd, bdn, dw, dwn, cd, votes_dict):
	# headings
	headings = ['dish', 'borna', 'borda_normalized', 'dowall', 'dowall_normalized', 'condorcet_count', 'num_votes']

	with open('summary_data.csv', 'w') as f:
		for h in range(0, len(headings)):
			if h != (len(headings)-1):
				f.write("%s,"%(headings[h]))
			else:
				f.write("%s\n"%(headings[h]))
		for key in keys:
			f.write("%s,%s,%s,%s,%s,%s,%s\n"%(key,bd[key],bdn[key],dw[key],dwn[key],cd[key],len(votes_dict[key])))


def write_votes_to_file(keys, all_votes):
	with open('vote_data.csv', 'w') as f:
		f.write("dish,votes\n")

		for key in keys:
			f.write("%s,"%(key))
			votes = all_votes[key]
			for h in range(0, len(votes)):
				if h != len(votes)-1:
					f.write("%s-"%(votes[h]))
				else:
					f.write("%s\n"%(votes[h]))

def main():
	# borda system 
	bd, bdn = borda_winner(dish_to_votes)
	bdn_sorted = sort_dict(bdn)
	bd_sorted = sort_dict(bd)

	s = "Normalized results using Borda ranked vote counting system:"
	print_results(bdn_sorted, s, dish_to_votes)

	s= "Non-normalized results using Borda ranked vote counting system:"
	print_results(bd_sorted, s, dish_to_votes)

	# dowall system
	dw, dwn = dowall_winner(dish_to_votes)
	dwn_sorted = sort_dict(dwn)
	dw_sorted = sort_dict(dw)

	s = "Normalized results using Dowdall ranked vote counting system:"
	print_results(dwn_sorted, s, dish_to_votes)
	s = "Non-normalized results using Dowdall ranked vote counting system:"
	print_results(dw_sorted, s, dish_to_votes)

	# condorcet system 
	cd, winners = condorcet_system(dish_to_all_votes)
	cd_sorted = sort_dict(cd)
	s = "Winners using Condorcet system (non-normalized):"
	print_results(cd_sorted, s, dish_to_votes)

	write_to_file(dish_to_votes.keys(), dish_to_votes, bd, bdn, dw, dwn, cd)
	write_summary_to_file(dish_to_votes.keys(), bd, bdn, dw, dwn, cd, dish_to_votes)
	write_votes_to_file(dish_to_votes.keys(), dish_to_votes)

main()







